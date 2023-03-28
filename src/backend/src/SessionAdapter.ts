import {
  INestApplicationContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler } from 'express';
import * as passport from 'passport';
import { Server, ServerOptions, Socket } from 'socket.io';
import { Intra42Strategy } from './auth/intra.strategy';
import { AuthSocket } from './chat/ws.authenticated.guard';
import AuthenticateRet from 'passport';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { WsException } from '@nestjs/websockets';
import { SocketExceptions } from './game/ws.validation-pipe';

export class SessionAdapter extends IoAdapter {
  private session: RequestHandler;

  constructor(session: RequestHandler, app: INestApplicationContext) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: any): any {
    const server = super.create(port, options);

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    // verify that the client is authenticated and bind client.user to client.request.user
    server.use((socket: any, next) => {
      // next(new WsException('Invalid or missing token'));
      if (!socket.request.isAuthenticated()) {
        
        next(new WsException('Invalid or missing token'));
      } else {
        socket.user = socket.request.user;
        next();
      }
    });

    return server;
  }
}
