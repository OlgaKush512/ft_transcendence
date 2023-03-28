import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ChatMessage from 'src/entities/chatMessage.entity';
import ChatRoom, { ChatRoomType } from 'src/entities/chatRoom.entity';
import { UsersService } from 'src/users/users.service';
import { LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import ChatRole, { ChatRoleType } from 'src/entities/chatRole.entity';
import User from 'src/entities/user.entity';
import ChatBanned from 'src/entities/chatBanned.entity';
import { ChatRoomData } from 'src/types/ChatRoomData.dto';
import { ChatGateway } from './chat.gateway';
import ChatMuted from 'src/entities/chatMuted.entity';
import { MuteTime } from 'src/types/ChatMuteRequest.dto';
import { GameService } from 'src/game/game.service';

function makeId(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(ChatRole)
    private readonly chatRoleRepository: Repository<ChatRole>,

    @InjectRepository(ChatBanned)
    private readonly chatBannedRepository: Repository<ChatBanned>,

    @InjectRepository(ChatMuted)
    private readonly chatMutedRepository: Repository<ChatMuted>,

    private readonly userService: UsersService,

    private readonly chatGateway: ChatGateway,

    private readonly gameService: GameService,
  ) {}

  async findRoomById(roomId: string) {
    const room = await this.chatRoomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['roles', 'roles.user', 'messages'],
    });

    if (!room) throw new BadRequestException('Room does not exist');

    return room;
  }

  async findRoomByName(name: string) {
    const room = await this.chatRoomRepository.findOne({
      where: {
        name,
      },
      relations: ['roles'],
    });

    if (!room) throw new BadRequestException('Room does not exist');

    return room;
  }

  async checkRoomNameExists(name: string) {
    const room = await this.chatRoomRepository.findOne({
      where: {
        name: name,
      },
    });
    return room !== null;
  }

  async createRoom(
    OwnerId: number,
    type: ChatRoomType,
    name: string,
    password?: string,
  ) {
    const owner = await this.userService.findOneById(OwnerId);
    if (!owner) throw new InternalServerErrorException('User not found');

    if (await this.checkRoomNameExists(name))
      throw new BadRequestException('A room with the same name already exists');

    if (type === ChatRoomType.Protected && password === undefined)
      throw new BadRequestException('Password missing for protected room');

    const ownerRole = new ChatRole();
    ownerRole.role = ChatRoleType.Owner;
    ownerRole.user = owner;

    const room = new ChatRoom();
    room.id = makeId(10);
    room.name = name;
    room.roles = [ownerRole];
    room.type = type;
    room.password =
      type === ChatRoomType.Protected ? await bcrypt.hash(password, 10) : null;

    const createdRoom = await this.chatRoomRepository.save(room);
    (await this.chatGateway.findClient(owner.id)).join(room.id);
    return {
      id: createdRoom.id,
      name: createdRoom.name,
      lastMessage: null,
      type: createdRoom.type,
    };
  }

  async createPrivateRoom(owner: User, other: User) {
    const ownerRole = new ChatRole();
    ownerRole.role = ChatRoleType.Owner;
    ownerRole.user = owner;

    const otherRole = new ChatRole();
    otherRole.role = ChatRoleType.Member;
    otherRole.user = other;

    const room = new ChatRoom();
    room.id = makeId(10);
    room.name = '';
    room.roles = [ownerRole, otherRole];
    room.type = ChatRoomType.Private;

    const createdRoom = await this.chatRoomRepository.save(room);
    return createdRoom.id;
  }

  async canAccessRoom(userId: number, roomId: string) {
    const room = await this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roles', 'roles')
      .leftJoinAndSelect('roles.user', 'user')
      .where('room.id=:id', { id: roomId })
      .getOne();

    return room.roles.find((role) => role.user.id === userId) !== undefined;
  }

  async getLastMessage(user: User, room: ChatRoom) {
    const members = room.roles.map((role) => role.user);
    const userHasBlocked = await Promise.all(
      members.map(async (member) =>
        (await this.userService.isBlockedBy(user, member)) ? member.id : -1,
      ),
    );

    return await this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.room', 'room')
      .leftJoinAndSelect('message.user', 'user')
      .where('room.id=:id', { id: room.id })
      .andWhere('user.id NOT IN (:...blocked)', { blocked: userHasBlocked })
      .orderBy('message.id', 'DESC')
      .select(['message.text', 'message.sentAt', 'user.username'])
      .getOne();
  }

  async rooms(user: User) {
    const rooms = await this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoin('room.roles', 'roles')
      .leftJoinAndSelect('room.roles', 'rolesSelected')
      .leftJoin('roles.user', 'user')
      .leftJoinAndSelect('rolesSelected.user', 'userSelected')
      .where('user.id=:id', { id: user.id })
      .getMany();
    return rooms;
  }

  async getRooms(user: User) {
    let rooms = await this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roles', 'roles')
      .leftJoinAndSelect('room.roles', 'rolesSelected')
      .leftJoinAndSelect('roles.user', 'user')
      .leftJoinAndSelect('rolesSelected.user', 'userSelected')
      .where('user.id=:id', { id: user.id })
      .getMany();

    let ret = await Promise.all(
      rooms.map<Promise<ChatRoomData>>(async (room) => {
        const lastMessage = await this.getLastMessage(user, room);
        const userRole = room.roles.find((role) => role.user.id === user.id);
        if (
          room.type === ChatRoomType.Private &&
          userRole.role !== ChatRoleType.Owner &&
          !lastMessage
        )
          return null;

        const roomName =
          room.type === ChatRoomType.Private
            ? room.roles.find((role) => role.user.id !== user.id).user.username
            : room.name;

        let imageUrl = null;
        if (room.type === ChatRoomType.Private) {
          const other = room.roles.find(
            (role) => role.user.id !== user.id,
          ).user;
          imageUrl = other.imageUrl;
        }

        return {
          id: room.id,
          name: roomName,
          type: room.type,
          unreadMessages: await this.unseenMessages(user, room),
          lastMessage: lastMessage
            ? {
                from: lastMessage.user.username,
                text: lastMessage.text,
                sentAt: lastMessage.sentAt,
                id: lastMessage.id,
              }
            : null,
          imageUrl: imageUrl,
        };
      }),
    );

    ret = ret.filter((room) => room !== null);

    return ret;
  }

  async findRole(user: User, room: ChatRoom) {
    return await this.chatRoleRepository
      .createQueryBuilder('role')
      .leftJoin('role.user', 'user')
      .leftJoin('role.room', 'room')
      .where('user.id=:userId', { userId: user.id })
      .andWhere('room.id=:roomId', { roomId: room.id })
      .getOne();
  }

  async removeUser(user: User, room: ChatRoom) {
    const role = await this.findRole(user, room);
    if (role) {
      await this.chatRoleRepository.delete(role.id);
    }
  }

  async leaveRoom(user: User, room: ChatRoom) {
    await this.removeUser(user, room);
    this.chatGateway.server.to(room.id).emit('leave', {
      roomId: room.id,
      userId: user.id,
      username: user.username,
    });
  }

  async ban(moderator: User, user: User, room: ChatRoom) {
    await this.chatBannedRepository.save(
      this.chatBannedRepository.create({ room, user }),
    );
    this.removeUser(user, room);
    const gatewayClient = await this.chatGateway.findClient(user.id);
    this.chatGateway.server.to(room.id).emit('ban', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
      by: moderator.username,
    });
  }

  async unban(moderator: User, user: User, room: ChatRoom) {
    const row = await this.chatBannedRepository
      .createQueryBuilder('banned')
      .leftJoinAndSelect('banned.user', 'user')
      .leftJoinAndSelect('banned.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    if (!row) throw new BadRequestException('User is not banned');

    await this.chatBannedRepository.delete(row.id);
    this.chatGateway.server.to(room.id).emit('unban', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
      by: moderator.username,
    });
  }

  async isBanned(user: User, room: ChatRoom) {
    const row = await this.chatBannedRepository
      .createQueryBuilder('banned')
      .leftJoinAndSelect('banned.user', 'user')
      .leftJoinAndSelect('banned.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    return row !== null;
  }

  async getBanned(room: ChatRoom) {
    const rows = await this.chatBannedRepository
      .createQueryBuilder('banned')
      .leftJoinAndSelect('banned.room', 'room')
      .leftJoinAndSelect('banned.user', 'user')
      .where('room.id=:roomId', { roomId: room.id })
      .getMany();

    return rows;
  }

  // Allows a moderator to mute a user for a defined or undefined duration
  async mute(moderator: User, user: User, room: ChatRoom, time: MuteTime) {
    // default duration is undefined
    let until = null;

    // Calculate the end date if the duration was defined
    switch (time) {
      case MuteTime.ThirtySeconds:
        until = new Date();
        until.setTime(until.getTime() + 30 * 1000);
        break;
      case MuteTime.FiveMinutes:
        until = new Date();
        until.setTime(until.getTime() + 5 * 60 * 1000);
        break;
      case MuteTime.OneHour:
        until = new Date();
        until.setTime(until.getTime() + 60 * 60 * 1000);
        break;
    }

    // Verify if the user is currently muted
    const row = await this.chatMutedRepository
      .createQueryBuilder('row')
      .leftJoin('row.user', 'user')
      .leftJoin('row.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    // If so, only update the duration
    if (row) await this.chatMutedRepository.update(row.id, { ...row, until });
    // else create a new record in the DB
    else
      await this.chatMutedRepository.save(
        this.chatMutedRepository.create({ room, user, until }),
      );

    // Send a socket event to the clients in the room
    this.chatGateway.server.to(room.id).emit('mute', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
      by: moderator.username,
      for: time,
    });
    // Set an unmute timeout if the duration is defined
    // if (until) this.chatGateway.registerUnmuteTimeout(gatewayClient, user, room, until);
  }

  async muteWatcher() {
    const toUnmute = await this.chatMutedRepository.find({
      where: { until: LessThan(new Date()) },
      relations: ['user', 'room'],
    });
    toUnmute.forEach((row) => this.unmuteScheduled(row.user, row.room));
  }

  // Automatic unmute function called when the mute duration has passed
  async unmuteScheduled(user: User, room: ChatRoom) {
    const row = await this.chatMutedRepository
      .createQueryBuilder('row')
      .leftJoin('row.user', 'user')
      .leftJoin('row.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    // Verify that the user is muted
    if (!row) return;

    // Delete the row in the DB
    await this.chatMutedRepository.delete(row.id);

    // Send a socket event to the clients
    this.chatGateway.server.to(room.id).emit('unmute', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
    });
  }

  // Allows a moderator to unmute a user
  async unmute(moderator: User, user: User, room: ChatRoom) {
    const row = await this.chatMutedRepository
      .createQueryBuilder('row')
      .leftJoin('row.user', 'user')
      .leftJoin('row.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    // Verify that the user is indeed muted
    if (!row) throw new BadRequestException('User is not muted');

    // Delete the row in the DB
    await this.chatMutedRepository.delete(row.id);

    // Send a socket event to the clients
    this.chatGateway.server.emit('unmute', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
      by: moderator.username,
    });
  }

  async isMuted(user: User, room: ChatRoom) {
    
    const row = await this.chatMutedRepository
      .createQueryBuilder('row')
      .leftJoin('row.user', 'user')
      .leftJoin('row.room', 'room')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere('user.id=:userId', { userId: user.id })
      .getOne();
    return row === null ? null : row.until;
  }

  async joinRoom(user: User, room: ChatRoom, password?: string) {
    if (!room) throw new BadRequestException('Room does not exist');

    if (await this.canAccessRoom(user.id, room.id))
      throw new BadRequestException('User is already a member of this room');

    if (await this.isBanned(user, room))
      throw new BadRequestException('Room does note exist');

    if (room.type === ChatRoomType.Protected) {
      if (!password)
        throw new UnauthorizedException('This room is password protected');
      if (!bcrypt.compareSync(password, room.password))
        throw new UnauthorizedException('Invalid password');
    }

    const role = this.chatRoleRepository.create({
      role: ChatRoleType.Member,
      room: room,
      user: user,
    });
    await this.chatRoleRepository.save(role);

    const chatGatewayClient = await this.chatGateway.findClient(user.id);
    if (chatGatewayClient) chatGatewayClient.join(room.id);
    this.chatGateway.server
      .to(room.id)
      .emit('join', { userId: user.id, roomId: room.id });
  }

  async changePassword(
    user: User,
    room: ChatRoom,
    oldPassword: string,
    newPassword: string | undefined,
  ) {
    if (!bcrypt.compareSync(oldPassword, room.password))
      throw new UnauthorizedException('Invalid password');

    if (!newPassword || !newPassword.length) {
      room.type = ChatRoomType.Public;
      room.password = null;
    } else {
      room.password = await bcrypt.hash(newPassword, 10);
    }
    await this.chatRoomRepository.save(room);
  }

  async saveMessage(user: User, room: ChatRoom, text: string) {
    const message = this.chatMessageRepository.create({
      room,
      text,
      user,
      seenBy: [`${user.id}`],
    });
    return await this.chatMessageRepository.save(message);
  }

  async getPrivateRoomId(user1: User, user2: User): Promise<string | null> {
    const userPrivateRoomIdsQuery = this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoin('room.roles', 'roles')
      .where(`room.type='private'`)
      .andWhere(`roles.user=${user1.id}`)
      .select('room.id')
      .getQuery();

    const targetPrivateRooIdsQuery = this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoin('room.roles', 'roles')
      .where(`room.type='private'`)
      .andWhere(`roles.user=${user2.id}`)
      .select('room.id')
      .getQuery();

    const mutualPrivateRoomIds = await this.chatRoomRepository.query(
      `${userPrivateRoomIdsQuery} INTERSECT ${targetPrivateRooIdsQuery}`,
    );
    return mutualPrivateRoomIds.length
      ? (mutualPrivateRoomIds[0].room_id as string)
      : null;
  }

  async getMessages(user: User, room: ChatRoom, lastMessageId?: number) {
    let lastMessage;
    
    if (lastMessageId) {
      lastMessage = await this.chatMessageRepository.findOne({
        where: { id: lastMessageId },
      });
      if (!lastMessage) lastMessageId = undefined;
    }
    const take = 10;

    const members = room.roles.map((role) => role.user);
    const userHasBlocked = await Promise.all(
      members.map(async (member) =>
        (await this.userService.isBlockedBy(user, member)) ? member.id : -1,
      ),
    );

    let messages;
    if (lastMessageId) {
      messages = await this.chatMessageRepository
        .createQueryBuilder('message')
        .leftJoin('message.room', 'room')
        .leftJoinAndSelect('message.user', 'user')
        .where('room.id=:id', { id: room.id })
        .andWhere('user.id NOT IN (:...blocked)', { blocked: userHasBlocked })
        .andWhere('message.id<:lastMessageId', { lastMessageId })
        .orderBy('message.id', 'DESC')
        .select([
          'message.id AS id',
          'message.text AS text',
          'message.sentAt AS sentAt',
          'user.username AS from',
        ])
        .limit(take)
        .getRawMany();
    } else {
      messages = await this.chatMessageRepository
        .createQueryBuilder('message')
        .leftJoin('message.room', 'room')
        .leftJoinAndSelect('message.user', 'user')
        .where('room.id=:id', { id: room.id })
        .andWhere('user.id NOT IN (:...blocked)', { blocked: userHasBlocked })
        .orderBy('message.id', 'DESC')
        .select([
          'message.id AS id',
          'message.text AS text',
          'message.sentAt AS sentAt',
          'user.username AS from',
        ])
        .limit(take)
        .getRawMany();
    }

    const hasMore = messages.length === take;
    return {
      hasMore,
      messages: messages
        .map((msg) => ({ ...msg, sentAt: msg.sentat }))
        .sort((a, b) => (a.id > b.id ? 1 : -1)),
    };
  }

  async getRoom(user: User, roomId: string) {
    const room = await this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roles', 'roles')
      .leftJoinAndSelect('roles.user', 'user')
      .where('room.id=:id', { id: roomId })
      .getOne();

    if (!room) throw new BadRequestException('Room not found');
    if (room.roles.find((role) => role.user.id === user.id) === undefined)
      throw new BadRequestException('User not member of this room');
    const { messages, hasMore } = await this.getMessages(user, room);
    return {
      type: room.type,
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      role: room.roles.find((role) => role.user.id === user.id).role,
      users: await Promise.all(
        room.roles.map(async (role) => ({
          id: role.user.id,
          username: role.user.username,
          imageUrl: role.user.imageUrl,
          role: role.role,
          muted: (await this.isMuted(role.user, room)) !== null,
          inGame: this.gameService.isInGame(role.user.id),
          gameId: this.gameService.getGameId(role.user.id),
        })),
      ),
      messages: messages.map((msg) => ({
        sentAt: msg.sentAt,
        text: msg.text,
        from: msg.from,
        id: msg.id,
      })),
      hasMoreMessages: hasMore,
      muted: (await this.isMuted(user, room)) !== null,
      banned: (await this.getBanned(room)).map((user) => ({
        id: user.user.id,
        username: user.user.username,
        imageUrl: user.user.imageUrl,
      })),
    };
  }

  async getUsersInRoom(roomId: string) {
    const room = await this.chatRoomRepository.findOne({
      where: [{ id: roomId }],
      relations: ['roles', 'roles.user'],
    });
    if (!room)
      throw new InternalServerErrorException(
        'Failed trying to list the users in the room',
      );
    return room.roles.map((role) => role.user);
  }

  async updateRole(user: User, room: ChatRoom, role: ChatRoleType) {
    const roleEntry = await this.chatRoleRepository
      .createQueryBuilder('role')
      .leftJoin('role.user', 'user')
      .leftJoin('role.room', 'room')
      .where('user.id=:userId', { userId: user.id })
      .andWhere('room.id=:roomId', { roomId: room.id })
      .getOne();

    if (!roleEntry)
      throw new BadRequestException("Couldn't find the user in this room");

    roleEntry.role = role;
    await this.chatRoleRepository.save(roleEntry);
    this.chatGateway.server.to(room.id).emit('change-role', {
      username: user.username,
      userId: user.id,
      roomId: room.id,
    });
  }

  async markMessagesAsSeen(roomId: string, userId: number) {
    await this.chatMessageRepository
      .createQueryBuilder()
      .update()
      .set({ seenBy: () => `seen_by || '"${userId}"'::jsonb` })
      .where('room.id=:roomId', { roomId: roomId })
      .andWhere(`NOT seen_by ? :userId`, { userId: userId.toString() })
      .execute();
  }

  async isMessageSeen(messageId: number, userId: number) {
    const ret = await this.chatMessageRepository
      .createQueryBuilder()
      .where(`seen_by ? :userId`, { userId: userId.toString() })
      .andWhere('id=:messageId', { messageId })
      .getOne();
    return ret !== null;
  }

  async unseenMessages(user: User, room: ChatRoom) {
    const members = room.roles.map((role) => role.user);
    const userHasBlocked = await Promise.all(
      members.map(async (member) =>
        (await this.userService.isBlockedBy(user, member)) ? member.id : -1,
      ),
    );

    return await this.chatMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.room', 'room')
      .leftJoinAndSelect('message.user', 'user')
      .where('room.id=:roomId', { roomId: room.id })
      .andWhere(`NOT seen_by ? :userId`, { userId: user.id.toString() })
      .andWhere('user.id NOT IN (:...blocked)', { blocked: userHasBlocked })
      .getCount();
  }
}
