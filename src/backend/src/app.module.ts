import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth42.service';
import { Auth42Module } from './auth/auth42.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { TwoFactorAuthModule } from './2fa/TwoFactorAuth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import BlockedAccount from './entities/blockedAccount.entity';
import FriendRequest from './entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import Notification from './entities/notification.entity';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { GameModule } from './game/game.module';
import Stats from './entities/stats.entity';
import Game from './entities/game.entity';
import Achievements from './entities/achievements.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        { rootPath: join(__dirname, configService.get<string>('CLIENT_BUILD_RELATIVE_PATH')) },
      ],
      inject: [ConfigService],
    }),
    Auth42Module,
    TwoFactorAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env.dev'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_APP_USER'),
        password: configService.get<string>('DB_APP_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/entities/*.entity.{ts,js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      BlockedAccount,
      FriendRequest,
      BlockedUser,
      Notification,
      Game,
      Achievements,
    ]),
    UsersModule,
    HttpModule,
    ChatModule,
    NotificationsModule,
    MatchmakingModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
