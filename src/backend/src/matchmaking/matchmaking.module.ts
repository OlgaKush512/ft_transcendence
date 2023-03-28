import { Module } from '@nestjs/common';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import { GameGateway } from 'src/game/game.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    GameModule,
    HttpModule,
    TypeOrmModule.forFeature([User, FriendRequest, BlockedUser]),
  ],
  controllers: [MatchmakingController],
  providers: [MatchmakingService, MatchmakingGateway],
})
export class MatchmakingModule {}
