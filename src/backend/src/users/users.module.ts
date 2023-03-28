import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import User from '../entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extension } from 'mime-types';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import Notification from 'src/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import Stats from 'src/entities/stats.entity';
import Game from 'src/entities/game.entity';
import Achievements from 'src/entities/achievements.entity';
import { GameModule } from 'src/game/game.module';

const uploadedFilenameFunc = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  callback(
    null,
    `${randomBytes(16).toString('hex')}.${extension(file.mimetype)}`,
  );
};

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      FriendRequest,
      BlockedUser,
      Notification,
      Game,
      Stats,
      Achievements,
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          filename: uploadedFilenameFunc,
          destination: configService.get<string>('IMAGE_UPLOAD_DEST'),
        }),
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
    GameModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
