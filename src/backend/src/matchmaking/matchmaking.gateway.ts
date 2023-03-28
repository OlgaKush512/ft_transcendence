import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { MatchmakingService } from './matchmaking.service';
import { Socket, Server } from 'socket.io';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import { disconnect, hasUncaughtExceptionCaptureCallback } from 'process';
import { ClientRequest } from 'http';
import { findSourceMap } from 'module';
import { AfterRemove } from 'typeorm';
import { lstat } from 'fs';
import { notDeepStrictEqual } from 'assert';
import { FakeStrategy } from 'src/auth/fake.strategy';
import { NestFactoryStatic } from '@nestjs/core/nest-factory';

@WebSocketGateway({
  namespace: 'matchmaking',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MatchmakingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(MatchmakingGateway.name);

  public clients: AuthSocket[] = [];
  @WebSocketServer() private Server: Server;

  constructor(
    @Inject(forwardRef(() => MatchmakingService))
    private readonly service: MatchmakingService,
  ) {}

  findClientFromSocketId(socketId: string) {
    return this.clients.find((client) => client.id === socketId);
  }

  findClientFromUserId(userId: number) {
    return this.clients.find((client) => client.user.id === userId);
  }

  afterInit(server: Server) {
    // Add a middleware before each connection to ensure that only one socket is connected per user
    // server.use((socket: AuthSocket, next) => {
    //   if (this.clients.find((client) => client.user.id === socket.user.id)) {
    //     return next(new WsException('User is already connected'));
    //   }
    //   return next();
    // });
  }

  handleConnection(client: AuthSocket) {
    const idx = this.clients.findIndex((c) => c.user.id === client.user.id);
    if (idx >= 0) this.clients.splice(idx, 0);
    this.clients.push(client);
    this.logger.debug(`Client connected - ID: ${client.id}`);
  }

  handleDisconnect(client: AuthSocket) {
    this.logger.debug(`Client disconnected - ID: ${client.id}`);
    // Remove the client from the array of connected clients
    this.clients.splice(
      this.clients.findIndex((c) => c.id === client.id),
      1,
    );
    

    this.service.removeFromQueues(client);
    const lobby = this.service.getLobbyFromOwner(client.user.id);
    if (lobby) this.service.destroyLobby(lobby.id);
  }

  @SubscribeMessage('ENTER_QUEUE')
  onEnterQueue(client: AuthSocket, gameType: 'classic' | 'bonus') {
    this.service.enterQueue(client.user.id, gameType);
  }

  @SubscribeMessage('LEAVE_QUEUE')
  async onLeaveQueue(client: AuthSocket) {
    this.service.leaveQueue(client.user.id);
  }

  // @SubscribeMessage('INVITE')
  // onInvite(client: AuthSocket, data: any) {
  //   this.service.sendInvitation(client.user.id, data.userId);
  // }
}
