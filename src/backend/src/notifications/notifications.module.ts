import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import Notification from 'src/entities/notification.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendRequest, BlockedUser, Notification]),
    forwardRef(() => UsersModule),
  ],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
