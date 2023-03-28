import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/user.entity';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import ChatMessage from 'src/entities/chatMessage.entity';
import ChatRoom from 'src/entities/chatRoom.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from 'src/users/users.module';
import ChatRole from 'src/entities/chatRole.entity';
import { ChatGateway } from './chat.gateway';
import { Auth42Module } from 'src/auth/auth42.module';
import { AuthService } from 'src/auth/auth42.service';
import ChatBanned from 'src/entities/chatBanned.entity';
import Notification from 'src/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import ChatMuted from 'src/entities/chatMuted.entity';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      FriendRequest,
      BlockedUser,
      ChatMessage,
      ChatRoom,
      ChatRole,
      ChatBanned,
      ChatMuted,
      Notification,
    ]),
    UsersModule,
    NotificationsModule,
    Auth42Module,
    GameModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    AuthService,
    NotificationsService,
  ],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
