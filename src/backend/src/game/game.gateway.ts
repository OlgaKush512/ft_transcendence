import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  ConnectedSocket,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  forwardRef,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GameService } from './game.service';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import { Game, Player } from './gameAlgo';

export type GameSocket = AuthSocket & {
  data: {
    game: Game;
    player: Player;
  };
};

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(GameGateway.name);

  @WebSocketServer() public server: Server;
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  afterInit(server: Server) {}

  handleConnection(client: AuthSocket) {
    this.logger.debug(`Client connected - ID: ${client.id}`);
  }

  async handleDisconnect(client: GameSocket) {
    if (client.data.player) client.data.player.socket = null;
    this.logger.debug(`Client disconnected - ID: ${client.id}`);
    if (client.data.game) {
      if (client.data.player) client.data.game.triggerFinish(); //when player is leaving during game
    }
  }

  @SubscribeMessage('CONNECTED')
  onConnected(client: GameSocket, data: { id: string }): void {
    
    const games = this.gameService.findGamesOfUser(client); // get last id
    if (games.length > 1) {
      games.forEach((game, inx) => {
        if (inx !== games.length - 1)
          game.triggerFinish();
      });
    }
    const game = games[games.length - 1];
    if (!game) throw new WsException('This game does not exist or has ended');
    if (
      game.player1.userId === client.user.id &&
      game.player1.socket === null
    ) {
      game.bindPlayerSocket(game.player1, client);
      this.logger.debug(`Player 1 joined ${game.id}`);
    } else if (
      game.player2.userId === client.user.id &&
      game.player2.socket === null
    ) {
      game.bindPlayerSocket(game.player2, client);
      this.logger.debug(`Player 2 joined ${game.id}`);
    } else {
      client.emit('NOT_PLAYER', { id: data.id });
      return;
      // game.bindViewerSocket(client);
      // this.logger.debug(`Viewer joined ${game.id}`);
    }

    // this.logger.debug(`Player ${client.data.player._number} joined ${game.id}`);
    client.emit('SETUP', game.getGameState());
    if (!game.isFinished() && !game.isWaitingForPlayers()) {
      
      game.start();
      // this.server.to(game.rooms.players).emit('SETUP', game.getGameState());
    }
  }

  @SubscribeMessage('WATCH')
  onWatchConnected(client: GameSocket, data: { id: string }): void {
    
    const game = this.gameService.findGameById(data.id);
    if (!game) throw new WsException('This game does not exist or has ended');
    game.bindViewerSocket(client);
    this.logger.debug(`Viewer joined ${game.id}`);
    client.emit('SETUP', game.getGameState());
  }

  @SubscribeMessage('KEY_PRESSED')
  onKeyDOWN(client: GameSocket, data: { key: 'UP' | 'DOWN' }): void {
    const player = client.data.player;
    if (!player) return; // viewer
    player.paddle.update(data.key);
    this.server
      .to(client.data.game.rooms.all)
      .emit('PADDLE_MOVEMENT', { paddle: player._number, y: player.paddle.y });
  }

  @SubscribeMessage('GameEnds')
  onGameEnds(client: GameSocket, data: { end: any }): void {
    
    this.server
      .to(client.data.game.rooms.all)
      .emit('Ends', { end: data.end });
  }
}
