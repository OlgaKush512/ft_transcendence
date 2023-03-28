import { HttpModule, HttpService } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { Auth42Controller } from './auth42.controller';
import { AuthService } from './auth42.service';
import { Intra42Strategy } from './intra.strategy';
import { SessionSerializer } from './session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { TwoFactorAuthService } from '../2fa/TwoFactorAuth.service';
import { FakeStrategy } from './fake.strategy';
import BlockedAccount from 'src/entities/blockedAccount.entity';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import Notification from 'src/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorAuthModule } from 'src/2fa/TwoFactorAuth.module';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([
      User,
      BlockedAccount,
      FriendRequest,
      BlockedUser,
      Notification,
    ]),
    UsersModule,
    forwardRef(() => TwoFactorAuthModule),
  ],
  controllers: [Auth42Controller],
  providers: [Intra42Strategy, FakeStrategy, SessionSerializer, AuthService],
})
export class Auth42Module {}
