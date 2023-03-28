import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { UsersService } from './users/users.service';
import User from './entities/user.entity';
import { GameService } from './game/game.service';

@Injectable()
export class AppService {
  constructor(
    private readonly notificationGateway: NotificationsGateway,
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  getFakeData() {
    return {
      data: 'Some data from the server !!',
      credits: 'Gracefully powered by Sev ♡',
    };
  }

  getPublicDataWithId(user: User) {
    return {
      username: user.username,
      imageUrl: user.imageUrl,
      id: user.id
    };
  }
  
  async getUsers(user: User) {
    const connectedClients = this.notificationGateway.getClients();
    let online = await Promise.all(
      connectedClients.map(async (client) =>
        this.getPublicDataWithId(
          await this.usersService.findOneById(client.user.id),
        ),
      ),
    );
    online = online.filter((u) => u.username !== user.username);
    

    const friends = (
      {...await this.usersService.getFriends(user.id), id: user.id}
    ).friends.filter((u) => u.username !== user.username);
    const inGameIds = this.gameService.getUsersInGame();
    let inGame = (
      await Promise.all(
        inGameIds.map(async (userId) => this.usersService.findOneById(userId)),
      )
    ).map((user) => this.getPublicDataWithId(user));
    inGame = inGame.filter((u) => u.username !== user.username);

    let merged: { username: string; imageUrl: string; status: string[] }[] = [];
    friends.forEach((user) => {
      const idx = merged.findIndex((e) => e.username === user.username);
      if (idx >= 0) merged[idx].status.push('friend');
      else merged.push({ ...user, status: ['friend'] });
    });
    online.forEach((user) => {
      const idx = merged.findIndex((e) => e.username === user.username);
      if (idx >= 0) merged[idx].status.push('online');
      else merged.push({ ...user, status: ['online'] });
    });
    inGame.forEach((user) => {
      const idx = merged.findIndex((e) => e.username === user.username);
      if (idx >= 0) merged[idx].status.push('inGame');
      else merged.push({ ...user, status: ['inGame'] });
    });
    merged.filter((u) => u.username !== user.username);
    return {
      friends,
      online,
      inGame,
      merged,
    };
  }

  async getDashboardData(user: User) {
    return {
      isInitialized: user.isInitialized,
      rank: await this.usersService.getRank(user),
      history: await this.usersService.getGlobalHistory(),
      stats: await this.usersService.getGlobalStats(),
      ...(await this.getUsers(user)),
    };
  }
}
