import { Socket, Server } from 'socket.io';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import User from 'src/entities/user.entity';
import { v4 } from 'uuid';
import { GameSocket } from './game.gateway';

class Entity {
  width: number;
  height: number;
  x: number;
  y: number;
  xVel = 0;
  yVel = 0;

  constructor(w: number, h: number, x: number, y: number) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
  }
}

class Paddle extends Entity {
  public speed = 2.5;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
  }

  public update(direction: 'UP' | 'DOWN'): any {
    if (direction === 'UP') {
      this.yVel = -1;
      if (this.y <= 0) this.yVel = 0;
    } else if (direction === 'DOWN') {
      this.yVel = 1;
      if (this.y >= GAME_HEIGHT - this.height) this.yVel = 0;
    }
    this.y += this.yVel * this.speed;
  }
}

class Ball extends Entity {
  public speed = 0.5;
  public score1 = 0;
  public score2 = 0;

  constructor(w: number, h: number, x: number, y: number) {
    super(w, h, x, y);
    var randomDirection = Math.floor(Math.random() * 2) + 1;
    if (randomDirection % 2) this.xVel = 1;
    // if (1 % 2) this.xVel = 1;
    else this.xVel = -1;
    this.yVel = 1;
  }

  update(paddle1: Paddle, paddle2: Paddle) {
    //check top canvas bounds
    if (this.y <= BALL_SIZE) this.yVel = 1;

    //check bottom canvas bounds
    if (this.y + this.height >= GAME_HEIGHT - BALL_SIZE) this.yVel = -1;

    //check left canvas bounds
    if (this.x <= 0) {
      this.x = GAME_WIDTH / 2 - this.width / 2;
      this.score2 += 1;
    }

    //check right canvas bounds
    if (this.x + this.width >= GAME_WIDTH) {
      this.x = GAME_WIDTH / 2 - this.width / 2;
      this.score1 += 1;
    }

    //check player collision
    if (this.x <= paddle1.x + paddle1.width) {
      if (
        this.y >= paddle1.y &&
        this.y + this.height <= paddle1.y + paddle1.height
      )
        this.xVel = 1;
    }

    //check player2 collision
    if (this.x + this.width >= paddle2.x) {
      if (
        this.y >= paddle2.y &&
        this.y + this.height <= paddle2.y + paddle2.height
      )
        this.xVel = -1;
    }

    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
  }
}

export class PendingGame {
  public player1: { id: number; socket: AuthSocket | null };
  public player2: { id: number; socket: AuthSocket | null };
  public id = v4();

  constructor(player1Id: number, player2Id: number) {
    this.player1 = { id: player1Id, socket: null };
    this.player2 = { id: player2Id, socket: null };
  }

  isReady() {
    return this.player1.socket && this.player2.socket;
  }
}

export type Player = {
  paddle: Paddle;
  score: number;
  socket: GameSocket | null;
  userId: number;
  _number: 1 | 2;
};

type GameState = 'WAITING_FOR_PLAYERS' | 'PAUSED' | 'RUNNING' | 'FINISHED' | 'TMP';
/* GAME ALGO */

const GAME_WIDTH = 100;
const GAME_HEIGHT = 100;
const PADDLE_WIDTH = 2;
const PADDLE_HEIGHT = 20;
const BALL_SIZE = 1;

export class Game {
  public id: string;
  public keysPressed: boolean[] = [];

  public players = new Map<number, Player>();
  public player1: Player;
  public player2: Player;

  public ball = new Ball(BALL_SIZE, BALL_SIZE, 50, 50);
  public intervalHandle: NodeJS.Timer | null = null;
  public rooms = { players: '', viewers: '', all: '' };
  private state: GameState;
  private gameType: 'classic' | 'bonus';

  private onFinish: (game: Game) => void;

  constructor(
    private server: Server,
    user1Id: number,
    user2Id: number,
    gameType: 'classic' | 'bonus',
    onFinish: (game: Game) => void,
  ) {
    this.gameType = gameType;
    this.onFinish = onFinish;
    this.id = v4();
    this.player1 = {
      paddle: new Paddle(
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        0,
        (GAME_HEIGHT - PADDLE_WIDTH) / 2,
      ),
      score: 0,
      socket: null,
      userId: user1Id,
      _number: 1,
    };
    this.player2 = {
      paddle: new Paddle(
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        GAME_WIDTH - PADDLE_WIDTH,
        (GAME_HEIGHT - PADDLE_WIDTH) / 2,
      ),
      score: 0,
      socket: null,
      userId: user2Id,
      _number: 2,
    };
    this.players.set(this.player1.userId, this.player1);
    this.players.set(this.player2.userId, this.player2);
    this.player1.score = 0;
    this.player2.score = 0;
    this.rooms.players = `players-${this.id}`;
    this.rooms.viewers = `viewers-${this.id}`;
    this.rooms.all = `all-${this.id}`;

    this.state = 'WAITING_FOR_PLAYERS';
  }

  public bindPlayerSocket(player: Player, socket: GameSocket) {
    socket.data.game = this;
    socket.data.player = player;

    player.socket = socket;
    player.socket.join([this.rooms.players, this.rooms.all]);
    player.socket.join([this.rooms.players, this.rooms.all]);
    if (this.player1.socket && this.player2.socket) this.state = 'PAUSED';
  }

  public bindViewerSocket(socket: GameSocket) {
    socket.data.game = this;
    socket.data.player = null;
    socket.join([this.rooms.viewers, this.rooms.all]);
  }

  public start() {
    
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.intervalHandle = setInterval(() => {
      // 
      // 
      this.ball.update(this.player1.paddle, this.player2.paddle);
      this.server.to(this.rooms.all).emit('BALL_POSITION', {
        x: this.ball.x,
        y: this.ball.y,
        score1: this.ball.score1,
        score2: this.ball.score2,
      });
      if (this.ball.score1 >= 10 || this.ball.score2 >= 10) this.stop();
    }, 20);
  }

  public stop() {
    if (this.state === 'FINISHED')
      return;
    this.state = 'FINISHED';
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    this.intervalHandle = null;
    this.onFinish(this);
  }

  public triggerFinish() {
    this.state = 'TMP';
    // this.state = 'FINISHED';
    
    this.stop();
    this.state = 'FINISHED';
    this.server.to(this.rooms.all).emit('playerLeft');
  }

  public getGameState() {
    return {
      gameType: this.gameType,
      paddle1: {
        speed: this.player1.paddle.speed,
        pos: {
          x: this.player1.paddle.x,
          y: this.player1.paddle.y,
        },
        height: this.player1.paddle.height,
        width: this.player1.paddle.width,
      },
      paddle2: {
        speed: this.player2.paddle.speed,
        pos: {
          x: this.player2.paddle.x,
          y: this.player2.paddle.y,
        },
        height: this.player2.paddle.height,
        width: this.player2.paddle.width,
      },
      ball: {
        pos: {
          x: this.ball.x,
          y: this.ball.y,
        },
      },
      score: { player1: this.player1.score, player2: this.player2.score },
    };
  }

  public isWaitingForPlayers() {
    return this.state === 'WAITING_FOR_PLAYERS';
  }

  public isPaused() {
    return this.state === 'PAUSED';
  }

  public isRunning() {
    return this.state === 'RUNNING';
  }

  public isFinished() {
    return this.state === 'FINISHED';
  }
}
