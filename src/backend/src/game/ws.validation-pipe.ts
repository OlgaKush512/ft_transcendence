// import { Injectable, ValidationPipe } from '@nestjs/common';
// import { ServerException } from '@app/game/server.exception';
// import { SocketExceptions } from '@shared/server/SocketExceptions';
import { WsException } from '@nestjs/websockets';

export enum SocketExceptions {
  // General
  UnexpectedError = 'exception.unexpected_error',
  UnexpectedPayload = 'exception.unexpected_payload',

  // Lobby
  LobbyError = 'exception.lobby.error',

  // Game
  GameError = 'exception.game.error',
}

type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export class ServerException extends WsException {
  constructor(type: SocketExceptions, message?: string | object) {
    const serverExceptionResponse: ServerExceptionResponse = {
      exception: type,
      message: message,
    };

    super(serverExceptionResponse);
  }
}
// @Injectable()
// export class WsValidationPipe extends ValidationPipe {
//   createExceptionFactory() {
//     return (validationErrors = []) => {
//       if (this.isDetailedOutputDisabled) {
//         return new ServerException(SocketExceptions.UnexpectedError, 'Bad request');
//       }

//       const errors = this.flattenValidationErrors(validationErrors);

//       return new ServerException(SocketExceptions.UnexpectedPayload, errors);
//     };
//   }
// }