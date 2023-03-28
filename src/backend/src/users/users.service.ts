import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { IIntraProfile } from 'src/users/IntraProfile.interface';
import User from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { profile } from 'console';
import { CreateNewProfileRequestDTO } from '../types/UserCreateNewProfileRequest.dto';
import FriendRequest, {
  FriendRequestStatus,
} from 'src/entities/friendRequest.entity';
import { UserRequestFriendResponseDTO } from 'src/types/UserRequestFriendResponse.dto';
import { ApiGatewayTimeoutResponse } from '@nestjs/swagger';
import BlockedUser from 'src/entities/blockedUser.entity';
import Notification, {
  NotificationType,
} from 'src/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import Stats from 'src/entities/stats.entity';
import Game from 'src/entities/game.entity';
import Achievements from 'src/entities/achievements.entity';
import { Cookie } from 'express-session';
import { globalAgent } from 'http';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { GameService } from 'src/game/game.service';

export enum AchievementsFields {
  Welcome = 'achievement1',
  NotBad = 'achievement2',
  Expert = 'achievement3',
  Champion = 'achievement4',
}

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,

    @InjectRepository(BlockedUser)
    private readonly blockedUserRepository: Repository<BlockedUser>,

    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,

    @InjectRepository(Achievements)
    private readonly achievementsRepository: Repository<Achievements>,

    private readonly notificationService: NotificationsService,

    private readonly notificationGateway: NotificationsGateway,

    private readonly gameService: GameService,
  ) {}

  async findOrCreateFromIntra(profile: IIntraProfile) {
    
    let user = await this.findOneByEmail(profile.email);
    if (!user) {
      user = await this.createUser(profile);
    }
    return user;
  }

  async createUser(intraProfile: IIntraProfile) {
    const newUser = this.userRepository.create({
      email: intraProfile.email,
      intraId: intraProfile.id,
      login: intraProfile.login,
      username: null,
      stats: new Stats(),
      achievements: new Achievements(),
    });
    return this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async listAll() {
    return await this.userRepository.find();
  }

  async searchUser(me: User, query: string) {
    
    const users = await this.userRepository.find({
      where: [
        {
          username: Like(`%${query}%`),
        },
        { login: Like(`%${query}%`) },
      ],
      select: ['id', 'username', 'login', 'imageUrl'],
    });
    
    return await Promise.all(
      users.map(async (user) => ({
        ...user,
        isFriend: await this.isFriendWith(me, user),
        isBlocked: await this.isBlockedBy(me, user),
      })),
    );
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async findOneByIdOrThrow(id: number) {
    const user = await this.findOneById(id);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    return user;
  }

  async enableTwoFactorAuth(user: User) {
    return this.userRepository.save({
      id: user.id,
      isTwoFactorAuthEnabled: true,
    });
  }

  async disableTwoFactorAuth(user: User) {
    return this.userRepository.save({
      id: user.id,
      isTwoFactorAuthEnabled: false,
    });
  }

  async incrementConnectionCounter(user: User) {
    await this.userRepository.increment(
      { id: user.id },
      'connectionCounter',
      1,
    );
    return this.findOneById(user.id);
  }

  async checkUsernameExist(username: string) {
    const user = await this.userRepository
      .createQueryBuilder()
      .where('LOWER(username) = LOWER(:username)', { username })
      .getOne();
    
    return user !== null;
  }

  async updateUser(id: User['id'], newUser: Partial<User>) {
    await this.userRepository.update(id, {
      ...(newUser.email && { email: newUser.email }),
      ...(newUser.username && { username: newUser.username }),
      ...(newUser.imageUrl && { imageUrl: newUser.imageUrl }),
      ...(newUser.isTwoFactorAuthEnabled && {
        isTwoFactorAuthEnabled: newUser.isTwoFactorAuthEnabled,
      }),
    });
    return this.findOneById(id);
  }

  async createNewProfile(
    req: Request,
    username: string,
    image: Express.Multer.File,
  ) {
    
    const modifiedUser: Partial<User> = { username: username };
    if (image) modifiedUser.imageUrl = `/api/users/image/${image.filename}`;
    else modifiedUser.imageUrl = `/api/users/image/default.png`;
    await this.updateUser(req.user.id, modifiedUser);
    await this.markAsInitilized(req.user.id);
    return await this.findOneById(req.user.id);
  }

  async updatePhoto(req: Request, image: Express.Multer.File) {
    const modifiedUser: Partial<User> = {
      imageUrl: `/api/users/image/${image.filename}`,
    };
    await this.updateUser(req.user.id, modifiedUser);
  }

  async markAsInitilized(userId: number) {
    await this.userRepository.save({
      id: userId,
      isInitialized: true,
    });
    return this.findOneById(userId);
  }

  async isInitialized(userId: number) {
    return (await this.findOneById(userId)).isInitialized;
  }

  async friendRequestAlreadyPending(user1: User, user2: User) {
    const friendRequestsFound = await this.friendRequestRepository.findOne({
      where: [
        { creator: user1, receiver: user2, status: 'pending' },
        { creator: user2, receiver: user1, status: 'pending' },
      ],
    });
    return friendRequestsFound !== null;
  }

  /**
   * Check wether those two users are friends
   */
  async isFriendWith(user1: User, user2: User) {
    const friendRequestsFound = await this.friendRequestRepository.findOne({
      where: [
        { creator: user1, receiver: user2, status: 'accepted' },
        { creator: user2, receiver: user1, status: 'accepted' },
      ],
    });
    return friendRequestsFound !== null;
  }

  async isFriendRequested(user1: User, user2: User) {
    const friendRequestsFound = await this.friendRequestRepository.findOne({
      where: [{ creator: user1, receiver: user2, status: 'pending' }],
    });
    return friendRequestsFound !== null;
  }

  getUserPublicData(user: User) {
    return {
      username: user.username,
      imageUrl: user.imageUrl,
    };
  }

  /**
   * Check wether user 'by' has blocked user 'target'
   */
  async isBlockedBy(by: User, target: User) {
    return (
      (await this.blockedUserRepository.findOne({
        where: { blocker: by, target: target },
      })) !== null
    );
  }

  async getBlocked(userId: number) {
    // Get the user from its Id and verify is exists
    const user = await this.findOneById(userId);
    if (!user) throw new InternalServerErrorException('User not found');

    return {
      blocked: (
        await this.blockedUserRepository.find({
          where: { blocker: user },
          relations: ['target'],
        })
      ).map((blocked) => this.getUserPublicData(blocked.target)),
    };
  }

  /**
   * Block a user.
   *
   * Called from a request
   */
  async blockUser(userId: number, targetUsername: string) {
    // Get the user from its Id and verify is exists
    const user = await this.findOneById(userId);
    if (!user) throw new InternalServerErrorException('User not found');

    // Get the target from the username and verify it exist
    const target = await this.findOneByUsername(targetUsername);
    if (!target)
      throw new NotFoundException(`User ${targetUsername} does not exist.`);

    // Verify that the target is not already blocked
    if (await this.isBlockedBy(user, target))
      throw new BadGatewayException(
        `User ${targetUsername} is already blocked.`,
      );

    // If we are friend with the target, remove the friendship
    if (this.isFriendWith(user, target)) this.removeFriendByUser(user, target);

    // Add a record in the DB
    await this.blockedUserRepository.save({ blocker: user, target: target });
  }

  /**
   * Unblock a user.
   *
   * Called from a request
   */
  async unblockUser(userId: number, targetUsername: string) {
    // Get the user from its Id and verify is exists
    const user = await this.findOneById(userId);
    if (!user) throw new InternalServerErrorException('User not found');

    // Get the target from the username and verify it exist
    const target = await this.findOneByUsername(targetUsername);
    if (!target)
      throw new NotFoundException(`User ${targetUsername} does not exist.`);

    // Verify that the target is indeed blocked
    if (!(await this.isBlockedBy(user, target)))
      throw new BadGatewayException(`User ${targetUsername} is not blocked.`);

    // Find the record in the DB and delete it
    const entry = await this.blockedUserRepository.findOne({
      where: {
        blocker: user,
        target: target,
      },
    });
    await this.blockedUserRepository.delete(entry.id);
  }

  /**
   * Send a friend request.
   *
   * Called from a request
   */
  async sendFriendRequest(userId: number, friendUsername: string) {
    // Get the user from its Id and verify is exists
    const creator = await this.findOneById(userId);
    if (!creator) throw new InternalServerErrorException('User not found');

    // Check if the target friend exist
    const receiver = await this.findOneByUsername(friendUsername);
    if (!receiver)
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Check that we are not requesting ourselves
    if (creator.id === receiver.id)
      throw new BadRequestException('User cannot add himself as a friend.');

    // Check if we are blocked by the requested user
    if (await this.isBlockedBy(receiver, creator))
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Check if we don't have already blocked the target user
    if (await this.isBlockedBy(creator, receiver))
      throw new BadRequestException(
        'Cannot send friend request to a blocked user.',
      );

    // Check that we are not already friend we the target user
    if (await this.isFriendWith(creator, receiver))
      throw new BadRequestException('Those two users are already friends.');

    // Check that a friend request is not already pending
    if (await this.friendRequestAlreadyPending(creator, receiver))
      throw new BadRequestException(
        'A friend request involving those two users is already pending.',
      );

    await this.friendRequestRepository.save({
      creator,
      receiver,
      status: 'pending',
    });

    this.notificationService.notify(
      receiver,
      NotificationType.FriendRequestReceived,
      { friend: { id: creator.id, username: creator.username } },
    );
  }

  /**
   * Accept a friend request.
   *
   * Called from a request
   */
  async acceptFriendRequest(userId: number, friendUsername: string) {
    // Get the user from its Id and verify is exists
    const receiver = await this.findOneById(userId);
    if (!receiver) throw new InternalServerErrorException('User not found');

    // Check if the target friend exist
    const creator = await this.findOneByUsername(friendUsername);
    if (!creator)
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Check that we are not already friend with target
    if (await this.isFriendWith(receiver, creator))
      throw new BadRequestException('Those two users are already friends.');

    // Check that we have not been blocked by the target, otherwise act as if the target doesn't exist
    if (await this.isBlockedBy(creator, receiver))
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Search for the request in the DB
    const request = await this.friendRequestRepository.findOne({
      where: {
        creator: creator,
        receiver: receiver,
        status: 'pending',
      },
    });
    // Check that a request exist and is ready to accept
    if (request === null)
      throw new NotFoundException(`This request has expired`);

    // Accept the request and update the record in the DB
    request.status = 'accepted';
    await this.friendRequestRepository.update(request.id, request);
    this.notificationService.notify(
      creator,
      NotificationType.FriendRequestAccepted,
      { friend: { id: receiver.id, username: receiver.username } },
    );
  }

  /**
   * Decline a friend request.
   *
   * Called from a request
   */
  async declineFriendRequest(userId: number, friendUsername: string) {
    // Get the user from its Id and verify is exists
    const receiver = await this.findOneById(userId);
    if (!receiver) throw new InternalServerErrorException('User not found');

    // Check if the target friend exist
    const creator = await this.findOneByUsername(friendUsername);
    if (!creator)
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Check that we are not already friend with target
    if (await this.isFriendWith(receiver, creator))
      throw new BadRequestException('Those two users are already friends.');

    // Check that we have not been blocked by the target, otherwise act as if the target doesn't exist
    if (await this.isBlockedBy(creator, receiver))
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Search for the request in the DB
    const request = await this.friendRequestRepository.findOne({
      where: {
        creator: creator,
        receiver: receiver,
        status: 'pending',
      },
    });

    // Check that a request exist and is ready to accept
    if (request === null)
      throw new NotFoundException(`This request is expired`);

    // Decline the request and update the record in the DB
    request.status = 'declined';
    await this.friendRequestRepository.update(request.id, request);
  }

  /**
   * Find the friend request associated to those two users. Returns 'null' if no request is found
   */
  async findFriendRequest(user1: User, user2: User) {
    return this.friendRequestRepository.findOne({
      where: [
        { receiver: user1, creator: user2 },
        { receiver: user2, creator: user1 },
      ],
    });
  }

  /**
   * Remove a friend. This action will delete the friend request associated to those two users, wether it is accepted or pending.
   *
   * Called from a request
   */
  async removeFriend(userId: number, friendUsername: string) {
    const user = await this.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    // Check if the target friend exist
    const friend = await this.findOneByUsername(friendUsername);
    if (!friend)
      throw new NotFoundException(`User ${friendUsername} does not exist.`);

    // Check that we are friend with target
    // if (!(await this.isFriendWith(user, friend)))
    const friendRequestsFound = await this.friendRequestRepository.findOne({
      where: [
        { creator: user, receiver: friend, status: 'accepted' },
        { creator: user, receiver: friend, status: 'pending' },
        { creator: friend, receiver: user, status: 'accepted' },
        { creator: friend, receiver: user, status: 'pending' },
      ],
    });
    if (friendRequestsFound === null)
      throw new BadRequestException(
        `You are not friends with ${friend.username}`,
      );

    // Update the DB
    await this.removeFriendByUser(user, friend);
  }

  /**
   * Remove a friend. This action will delete the friend request associated to those two users, wether it is accepted or pending.
   */
  async removeFriendByUser(user1: User, user2: User) {
    // Find the request in the DB. We should have already verified that the 2 users are indeed friends
    const request = await this.findFriendRequest(user1, user2);
    if (!request) return;

    // Delete the record from the DB
    await this.friendRequestRepository.delete(request.id);
  }

  /**
   * Get the public data from all the friends of the user.
   *
   * Called from a request
   */
  async getFriends(userId: number) {
    // Get the user from its Id and verify is exists
    const user = await this.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');

    return await this.getFriendsByUser(user);
  }

  async getFriendsByUser(user: User) {
    const friendRequests = await this.friendRequestRepository.find({
      where: [
        { creator: user, status: 'accepted' },
        { receiver: user, status: 'accepted' },
      ],
      relations: ['creator', 'receiver'],
    });

    // Extract the data from the other user for each request found and return it
    return {
      friends: friendRequests.map((friendRequest) => {
        if (friendRequest.creator.id === user.id)
          return this.getUserPublicData(friendRequest.receiver);
        else return this.getUserPublicData(friendRequest.creator);
      }),
    };
  }

  async getFriendsAndPendingByUser(user: User) {
    const friendRequests = await this.friendRequestRepository.find({
      where: [
        { creator: user, status: 'accepted' },
        { receiver: user, status: 'accepted' },
        { creator: user, status: 'pending' },
        { receiver: user, status: 'pending' },
      ],
      relations: ['creator', 'receiver'],
    });

    // Extract the data from the other user for each request found and return it
    return {
      friends: friendRequests.map((friendRequest) => {
        if (friendRequest.creator.id === user.id)
          return {
            username: friendRequest.creator.username,
            imageUrl: friendRequest.creator.imageUrl,
          };
        else
          return {
            username: friendRequest.receiver.username,
            imageUrl: friendRequest.receiver.imageUrl,
          };
      }),
    };
  }

  async getStats(user: User) {
    const games = await this.gamesRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.player1', 'player1')
      .leftJoinAndSelect('game.player2', 'player2')
      .where('player1.id=:id', { id: user.id })
      .orWhere('player2.id=:id', { id: user.id })
      .getMany();

    const stats = {
      played: games.length,
      wins: games.filter(
        (game) => game.status === 'finished' && game.winnerId === user.id,
      ).length,
      loses: games.filter(
        (game) => game.status === 'finished' && game.winnerId !== user.id,
      ).length,
      points: games
        .map((game) => {
          if (game.player1.id === user.id) return game.player1Score;
          else return game.player2Score;
        })
        .reduce((prev, curr) => prev + curr, 0),
    };
    return stats;
  }

  async getOngoingGames() {
    const games = await this.gamesRepository.find({
      where: { status: 'in game' },
      relations: ['player1', 'player2'],
    });
    return games.map((game) => ({
      player1: {
        username: game.player1.username,
        imageUrl: game.player1.imageUrl,
      },
      player2: {
        username: game.player2.username,
        imageUrl: game.player2.imageUrl,
      },
      id: game.id,
    }));
  }

  async getHistory(user: User) {
    const games = await this.gamesRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.player1', 'player1')
      .leftJoinAndSelect('game.player2', 'player2')
      .where('player1.id=:id', { id: user.id })
      .orWhere('player2.id=:id', { id: user.id })
      .getMany();

    return games
      .filter((game) => game.status !== 'in game')
      .map((game) => ({
        player1: {
          username: game.player1.username,
          score: game.player1Score,
          winner:
            game.status === 'finished' && game.winnerId === game.player1.id,
        },
        player2: {
          username: game.player2.username,
          score: game.player2Score,
          winner:
            game.status === 'finished' && game.winnerId === game.player2.id,
        },
        status: game.status,
      }));
  }

  async getGlobalHistory() {
    const games = await this.gamesRepository
      .createQueryBuilder('game')
      .getMany();

    return games;
  }

  async getGlobalStats() {
    return await this.userRepository.find({
      select: ['username', 'stats'],
      relations: ['stats'],
    });
  }

  async getLadder() {
    const users = await this.userRepository.find();
    const stats = await Promise.all(
      users.map(async (user) => ({
        user: user,
        stats: await this.getStats(user),
      })),
    );
    return stats.sort((a, b) => b.stats.wins - a.stats.wins);
  }

  async getRank(user: User) {
    const ladder = await this.getLadder();
    const idx = ladder.findIndex((e) => e.user.id === user.id);

    return idx + 1;
  }

  async getAchievements(user: User) {
    const achievements = await this.achievementsRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });
    return achievements;
  }

  async getAchievementsList(user: User) {
    const achievements = await this.achievementsRepository.findOne({
      where: { user: user },
      relations: ['user'],
    });
    return {
      achievement1: achievements.achievement1,
      achievement2: achievements.achievement2,
      achievement3: achievements.achievement3,
      achievement4: achievements.achievement4,
      achievement5: achievements.achievement5,
    };
  }

  async getFriendsAndBlockedData(user: User) {
    const connectedClients = this.notificationGateway.getClients();
    let online = await Promise.all(
      connectedClients.map(
        async (client) => await this.findOneById(client.user.id),
      ),
    );

    const inGameIds = this.gameService.getUsersInGame();

    let requested = (
      await this.friendRequestRepository.find({
        where: [{ creator: user, status: 'pending' }],
        select: ['receiver'],
        relations: ['receiver'],
      })
    ).map((req) => req.receiver);
    requested = await Promise.all(
      requested.map(async (user) => ({
        ...user,
        online: online.find((u) => u.id === user.id) !== undefined,
        inGame: inGameIds.find((id) => user.id === id) !== undefined,
        wins: (await this.getStats(user)).wins,
      })),
    );

    let friends = (
      await this.friendRequestRepository.find({
        where: [
          { creator: user, status: 'accepted' },
          { receiver: user, status: 'accepted' },
        ],
        relations: ['receiver', 'creator'],
      })
    ).map((req) => (req.creator.id === user.id ? req.receiver : req.creator));
    friends = await Promise.all(
      friends.map(async (user) => ({
        ...user,
        online: online.find((u) => u.id === user.id) !== undefined,
        inGame: inGameIds.find((id) => user.id === id) !== undefined,
        wins: (await this.getStats(user)).wins,
      })),
    );

    const blocked = await Promise.all(
      (
        await this.getBlocked(user.id)
      ).blocked.map((user) => this.findOneByUsername(user.username)),
    );

    return {
      requested: requested.map((user) => ({
        username: user.username,
        login: user.login,
        imageUrl: user.imageUrl,
        isOnline: (user as any).online,
        wins: (user as any).wins,
      })),
      friends: friends.map((user) => ({
        username: user.username,
        login: user.login,
        imageUrl: user.imageUrl,
        isOnline: (user as any).online,
        wins: (user as any).wins,
      })),
      blocked: blocked.map((user) => ({
        username: user.username,
        imageUrl: user.imageUrl,
      })),
    };
  }

  async saveAchievements(user: User, achievements: Achievements) {
    const current = await this.getAchievements(user);
    await this.achievementsRepository.save(achievements);
    Object.values(AchievementsFields).forEach((achievementField) => {
      if (!current[achievementField] && achievements[achievementField]) {
        this.notificationService.notify(user, NotificationType.NewAchievement, {
          achievement: achievementField,
        });
      }
    });
  }
}
