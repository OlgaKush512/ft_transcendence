import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Socket } from 'socket.io';
import { RequestUser } from 'src/auth/RequestUser.interface';
import { Request } from 'express';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;
    client.user = request.user;
    return request.isAuthenticated();
  }
}

export interface AuthSocket extends Socket {
  user: RequestUser;
  request: IncomingMessage & { user: RequestUser } & Request;
  data: { unmuteTimeouts: number };
}
