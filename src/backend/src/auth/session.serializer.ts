import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import User from 'src/entities/user.entity';
import { RequestUser } from './RequestUser.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: any) => void) {
    done(null, user);
  }
  deserializeUser(
    payload: RequestUser,
    done: (err: Error, payload: RequestUser) => void,
  ) {
    if (payload.twoFactorAuth.code)
      payload.twoFactorAuth.code.expiresAt = new Date(
        payload.twoFactorAuth.code.expiresAt,
      );
    done(null, payload);
  }
}
