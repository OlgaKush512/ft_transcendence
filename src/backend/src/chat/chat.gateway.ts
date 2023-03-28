import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';

import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth42.service';
import { AuthSocket, WsAuthenticatedGuard } from './ws.authenticated.guard';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChatRoomType } from 'src/entities/chatRoom.entity';

type IncomingMessage = {
  room: string;
  message: string;
};

type OutgoingMessage = {
  room: string;
  text: string;
  sentAt: Date;
  from: string;
  id: number;
};

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  private logger: Logger = new Logger('ChatGateway');
  private clients: AuthSocket[] = [];
  private unmuteTimeouts: {
    roomId: string;
    userId: number;
    handle: NodeJS.Timeout;
  }[] = [];

  async findClient(userId: number) {
    return this.clients.find((c) => c.user.id === userId) ?? null;
  }

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('send_message')
  async handleMessage(client: AuthSocket, data: IncomingMessage) {
    
    // Make sure that the user is authorized to send messages to this room.
    if (!(await this.chatService.canAccessRoom(client.user.id, data.room))) {
      this.logger.debug('user not authorized to send messages to this room');
      return;
      // throw new WsException('Unauthorized');
    }
    // Retrieve the user and room data from the DB.
    const user = await this.userService.findOneById(client.user.id);
    if (!user) throw new WsException('User not found');
    const room = await this.chatService.findRoomById(data.room);
    if (!room) throw new WsException('Room not found');

    
    // Verify that the user is not muted
    if (await this.chatService.isMuted(user, room))
      throw new WsException('User is muted');

    // Save the message in the DB
    const savedMessage = await this.chatService.saveMessage(
      user,
      room,
      data.message,
    );
    // Create the message that will be broadcasted to all users connected to the room
    const outgoingMessage: OutgoingMessage = {
      text: data.message,
      room: data.room,
      sentAt: savedMessage.sentAt,
      from: savedMessage.user.username,
      id: savedMessage.id,
    };

    // If its the first message in a private room
    if (room.type === ChatRoomType.Private && room.messages.length === 0) {
      const otherUser = room.roles.find((role) => role.user.id !== user.id);
      // Check if the other user is connected and if so, make them join the room to be notified of the message even tho the room is not yet visible to them
      const otherClient = await this.findClient(otherUser.user.id);
      if (otherClient) {
        otherClient.join(room.id);
        client.join(room.id);
      }
    }
    const members = room.roles.map((role) => role.user);
    const senderIsBlockedByUserIds = await Promise.all(
      members.map(async (member) =>
        (await this.userService.isBlockedBy(member, user)) ? member.id : -1,
      ),
    );
    const clientsToIgnore = this.clients.filter((client) =>
      senderIsBlockedByUserIds.includes(client.user.id),
    );
    clientsToIgnore.forEach((client) => client.join('BLOCKED'));
    client.broadcast
      .to(room.id)
      .except('BLOCKED')
      .emit('receive_message', outgoingMessage);
    clientsToIgnore.forEach((client) => client.leave('BLOCKED'));
  }

  @SubscribeMessage('seen_message')
  async messageSeen(client: AuthSocket, roomId: string): Promise<void> {
    await this.chatService.markMessagesAsSeen(roomId, client.user.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
    
    setInterval(this.chatService.muteWatcher.bind(this.chatService), 5000);
  }

  handleDisconnect(client: AuthSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove the client from the array of clients
    this.clients.splice(
      this.clients.findIndex((c) => c.id === client.id),
      1,
    );
  }

  async handleConnection(client: AuthSocket, ...args: any[]) {
    if (!client.request.isAuthenticated()) {
      client.disconnect();
      return;
    }
    // client.data.unmuteTimeouts = [];
    client.user = client.request.user;
    const user = await this.userService.findOneById(client.user.id);
    const rooms = await this.chatService.rooms(user);
    rooms.forEach(async (room) => {
      // Join each room
      client.join(room.id);
    });
    // Append the client to the array of clients
    this.clients.push(client);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
