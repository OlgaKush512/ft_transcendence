import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth/auth42.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorAuthController } from './TwoFactorAuth.controller';
import { TwoFactorAuthService } from './TwoFactorAuth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import BlockedAccount from 'src/entities/blockedAccount.entity';
import User from 'src/entities/user.entity';
import FriendRequest from 'src/entities/friendRequest.entity';
import BlockedUser from 'src/entities/blockedUser.entity';
import Notification from 'src/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { Auth42Module } from 'src/auth/auth42.module';

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, '../2fa/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
    UsersModule,
    forwardRef(() => Auth42Module),
  ],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
