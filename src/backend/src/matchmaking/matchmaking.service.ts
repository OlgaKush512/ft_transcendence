import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MatchmakingGateway } from './matchmaking.gateway';
import { v4 } from 'uuid';
import { GameService } from 'src/game/game.service';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import User from 'src/entities/user.entity';
import { WsException } from '@nestjs/websockets';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { NotificationType } from 'src/entities/notification.entity';

export class Lobby {
  public id = v4();
  public owner: { id: number; client: AuthSocket };
  private invitedUsersId: number[];
  private gameType: 'classic' | 'bonus';

  constructor(ownerClient: AuthSocket, gameType: 'classic' | 'bonus') {
    this.owner = { id: ownerClient.user.id, client: ownerClient };
    this.invitedUsersId = [];
    this.gameType = gameType;
  }

  addPendingInvitation(invitedUserId: number) {
    this.invitedUsersId.push(invitedUserId);
  }

  removePendingInvitation(invitedUserId: number) {
    this.invitedUsersId = this.invitedUsersId.filter(
      (id) => id !== invitedUserId,
    );
  }

  getGameType() {
    return this.gameType;
  }

  isInvited(invitedUserId: number) {
    return this.invitedUsersId.find((id) => id === invitedUserId) !== undefined;
  }

  hasPendingInvitations() {
    return this.invitedUsersId.length > 0;
  }
}

@Injectable()
export class MatchmakingService {
  private lobbies: Lobby[] = [];
  private classicQueue: AuthSocket[] = [];
  private bonusQueue: AuthSocket[] = [];

  constructor(
    private readonly gateway: MatchmakingGateway,
    private readonly gameService: GameService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  addToQueue(queue: AuthSocket[], client: AuthSocket) {
    queue.unshift(client);
  }

  removeFromQueue(queue: AuthSocket[], client: AuthSocket) {
    const idx = queue.findIndex((c) => c.id === client.id);
    if (idx >= 0) queue.splice(idx, 1);
  }

  removeFromQueues(client: AuthSocket) {
    this.removeFromQueue(this.classicQueue, client);
    this.removeFromQueue(this.bonusQueue, client);
  }

  popFromQueue(queue: AuthSocket[]) {
    return queue.pop();
  }

  createLobby(ownerSocket: AuthSocket, gameType: 'classic' | 'bonus') {
    const newLobby = new Lobby(ownerSocket, gameType);
    this.lobbies.push(newLobby);
    
    return newLobby;
  }

  destroyLobby(lobbyId: string) {
    this.lobbies = this.lobbies.filter((lby) => lby.id !== lobbyId);
  }

  getLobbyFromOwner(ownerId: number) {
    return this.lobbies.find((lby) => lby.owner.id === ownerId);
  }

  async enterQueue(userId: number, gameType: 'classic' | 'bonus') {
    
    let queue;
    if (gameType === 'classic') queue = this.classicQueue;
    else queue = this.bonusQueue;
    const playerSocket = this.gateway.findClientFromUserId(userId);
    if (!playerSocket) {
      
      return;
    }

    if (queue.find((client) => client.user.id === userId)) return;
    if (queue.length > 0) {
      const player1 = this.popFromQueue(queue);
      const game = await this.gameService.newGame(
        player1.user.id,
        playerSocket.user.id,
        gameType,
      );
      player1.emit('GAME_FOUND', { id: game.id });
      playerSocket.emit('GAME_FOUND', { id: game.id });
      return { id: game.id };
    } else {
      this.addToQueue(queue, playerSocket);
      
    }
  }

  leaveQueue(userId: number) {
    
    const playerSocket = this.gateway.findClientFromUserId(userId);

    if (!playerSocket) throw new BadRequestException('No WS found for client');

    let indexInQueue = this.classicQueue.findIndex(
      (client) => client.user.id === userId,
    );
    if (indexInQueue < 0) {
      indexInQueue = this.bonusQueue.findIndex(
        (client) => client.user.id === userId,
      );
      if (indexInQueue < 0) throw new BadRequestException('User not in queue');
      this.bonusQueue.splice(indexInQueue, 1);
    } else {
      this.classicQueue.splice(indexInQueue, 1);
    }
  }

  async sendInvitation(
    ownerId: number,
    invitedUsername: string,
    gameType: 'classic' | 'bonus',
  ) {
    // Make sure that the user is not already in queue
    if (
      this.bonusQueue.find((client) => client.user.id === ownerId) ||
      this.classicQueue.find((client) => client.user.id === ownerId)
    )
      throw new BadRequestException(
        'User cannot send invitations while in the queue',
      );

    const invited = await this.userService.findOneByUsername(invitedUsername);
    if (!invited) throw new BadRequestException('User not found');
    const owner = await this.userService.findOneByIdOrThrow(ownerId);
    // Retrieve the owner socket
    const ownerSocket = this.gateway.findClientFromUserId(ownerId);
    if (!ownerSocket) throw new BadRequestException('No WS found for client');

    // Retrieve the lobby or create on if it does not exist yet
    const lobby =
      this.lobbies.find((lobby) => lobby.owner.id === ownerId) ||
      this.createLobby(ownerSocket, gameType);

    

    // Register a new invitation for this lobby
    lobby.addPendingInvitation(invited.id);

    // send notification to the invited user
    this.notificationService.notify(
      invited,
      NotificationType.GameInvitationReceived,
      {
        friend: { id: owner.id, username: owner.username },
        lobby: { id: lobby.id },
      },
    );
  }

  async cancelInvitation(ownerId: number, invitedUsername: string) {
    
    // Make sure that the user is not already in queue
    if (
      this.bonusQueue.find((client) => client.user.id === ownerId) ||
      this.classicQueue.find((client) => client.user.id === ownerId)
    )
      throw new BadRequestException(
        'User cannot send invitations while in the queue',
      );

    const invited = await this.userService.findOneByUsername(invitedUsername);
    if (!invited) throw new BadRequestException('User not found');
    const owner = await this.userService.findOneByIdOrThrow(ownerId);
    // Retrieve the owner socket
    const ownerSocket = this.gateway.findClientFromUserId(ownerId);
    if (!ownerSocket) throw new BadRequestException('No WS found for client');

    // Retrieve the lobby or create on if it does not exist yet
    const lobby = this.lobbies.find((lobby) => lobby.owner.id === ownerId);

    lobby.removePendingInvitation(invited.id);
    if (!lobby.hasPendingInvitations())
      this.lobbies = this.lobbies.filter((lby) => lby.id !== lobby.id); // delete lobby if empty
    
    lobby.owner.client.emit('CANCELED_INVITATION', {
      username: invited.username,
    });
  }

  async acceptInvitation(user: User, lobbyId: string) {
    // Retrieve the lobby if it still exists
    const lobby = this.lobbies.find((lobby) => lobby.id === lobbyId);
    if (!lobby)
      throw new BadRequestException('Invitation not found or expired');

    if (!lobby.isInvited(user.id))
      throw new BadRequestException('Invitation not found or expired');

    // Create a new pending game while the 2 players connect to it
    const game = await this.gameService.newGame(
      lobby.owner.id,
      user.id,
      lobby.getGameType(),
    );

    // // Send an event to the owner telling him that his invitation was accepted and the new game id
    lobby.owner.client.emit('ACCEPTED_INVITATION', {
      by: { id: user.username, username: user.username },
      gameId: game.id,
    });

    // // Remove the lobby as we won't need it anymore
    this.destroyLobby(lobby.id);

    // Return the new pending game id to send it to the invited user in the response.
    return game;
  }

  async rejectInvitation(user: User, lobbyId: string) {
    // Retrieve the lobby if it still exists
    
    const lobby = this.lobbies.find((lobby) => lobby.id === lobbyId);
    if (!lobby)
      throw new BadRequestException('Invitation not found or expired');

    lobby.removePendingInvitation(user.id);
    if (!lobby.hasPendingInvitations())
      this.lobbies = this.lobbies.filter((lby) => lby.id !== lobby.id); // delete lobby if empty
    // Send an event to the owner telling him that his invitation was rejected
    lobby.owner.client.emit('REJECTED_INVITATION', {
      by: { id: user.username, username: user.username },
    });
  }
}
