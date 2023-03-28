import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Game, PendingGame, Player } from './gameAlgo';
import { v4 } from 'uuid';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import { GameGateway, GameSocket } from './game.gateway';
import { AchievementsFields, UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import GameEntity from '../entities/game.entity';
import { Repository } from 'typeorm';
import { compareSync } from 'bcrypt';

@Injectable()
export class GameService {
  private games: Game[] = [];

  constructor(
    private readonly gateway: GameGateway,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  destroyGame(gameId: string) {
    const idx = this.games.findIndex((game) => game.id === gameId);
    if (idx >= 0) this.games.splice(idx, 1);
  }

  async onGameFinish(game: Game) {
    
    
    
    const gameEntry = await this.gameRepository.findOne({
      where: { id: game.id },
    });
    
    if (gameEntry) {
      game.player1.score = game.ball.score1;
      game.player2.score = game.ball.score2;
      if (game.player1.score === 10 || game.player2.score === 10) {
        gameEntry.status = 'finished';
        gameEntry.winnerId =
          game.player1.score === 10 ? game.player1.userId : game.player2.userId;
      } else {
        gameEntry.status = 'canceled';
      }
      gameEntry.player1Score = game.player1.score;
      gameEntry.player2Score = game.player2.score;
      await this.gameRepository.save(gameEntry);

      await Promise.all(
        [game.player1, game.player2].map(async (player) => {
          const user = await this.userService.findOneById(player.userId);
          const stats = await this.userService.getStats(user);
          const rank = await this.userService.getRank(user);
          const achievements = await this.userService.getAchievements(user);
          if (stats.wins >= 1 && !achievements[AchievementsFields.Welcome]) {
            achievements[AchievementsFields.Welcome] = true;
          }
          if (stats.wins >= 5 && !achievements[AchievementsFields.NotBad]) {
            achievements[AchievementsFields.NotBad] = true;
          }
          if (stats.wins >= 10 && !achievements[AchievementsFields.Expert]) {
            achievements[AchievementsFields.Expert] = true;
          }
          if (rank === 1 && !achievements[AchievementsFields.Champion]) {
            achievements[AchievementsFields.Champion] = true;
          }
          await this.userService.saveAchievements(user, achievements);
        }),
      );
    }

    this.destroyGame(game.id);
  }

  async newGame(
    user1Id: number,
    user2Id: number,
    gameType: 'classic' | 'bonus',
  ) {
    const user1 = await this.userService.findOneById(user1Id);
    const user2 = await this.userService.findOneById(user2Id);
    const game = new Game(
      this.gateway.server,
      user1Id,
      user2Id,
      gameType,
      this.onGameFinish.bind(this),
    );
    this.games.push(game);
    await this.gameRepository.save(
      this.gameRepository.create({
        id: game.id,
        player1: user1,
        player2: user2,
        status: 'in game',
      }),
    );
    return game;
  }

  findGameByUser(userId: number) {
    return this.games.find((game) => game.player1.userId === userId);
  }

  findGameById(gameId: string) {
    return this.games.find((game) => game.id === gameId);
  }

  findGamesOfUser(client: GameSocket) {
    return this.games.filter(game => game.player1.userId === client.user.id || game.player2.userId === client.user.id);
  }

  getUsersInGame() {
    return this.games.reduce<number[]>(
      (prev, game) => [...prev, game.player1.userId, game.player2.userId],
      [],
    );
  }

  isInGame(userId: number) {
    return this.getUsersInGame().includes(userId);
  }

  getGameId(userId: number) {
    const game = this.games.find(
      (game) =>
        game.player1.userId === userId || game.player2.userId === userId,
    );
    return game ? game.id : null;
  }

  async getGameInfo(gameId: string) {
    const game = this.findGameById(gameId);
    if (!game) throw new BadRequestException('Game not found');
    const player1 = await this.userService.findOneById(game.player1.userId);
    const player2 = await this.userService.findOneById(game.player2.userId);

    return {
      player1: {
        user: this.userService.getUserPublicData(player1),
        stats: await this.userService.getStats(player1),
      },
      player2: {
        user: this.userService.getUserPublicData(player2),
        stats: await this.userService.getStats(player2),
      },
    };
  }
}
