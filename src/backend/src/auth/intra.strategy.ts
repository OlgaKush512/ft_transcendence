import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth42.service';
import { UsersService } from 'src/users/users.service';
import { IIntraProfile, reduceProfile } from 'src/users/IntraProfile.interface';
import { RequestUser } from './RequestUser.interface';
import { TwoFactorAuthService } from '../2fa/TwoFactorAuth.service';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private authService: AuthService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {
    super({
      clientID: configService.get<string>('INTRA_CLIENT_ID'),
      clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get<string>('INTRA_REDIRECT_URI'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { _json: IIntraProfile },
    done: (err: any, user: RequestUser) => void,
  ): Promise<any> {
    
    
    const user = await this.userService.findOrCreateFromIntra(profile._json);
    const intraProfile = reduceProfile(profile._json);
    const twoFactorAuth =
      this.twoFactorAuthService.generateInitialRequestUserStatus(user);

    const requestUser: RequestUser = {
      id: user.id,
      twoFactorAuth,
      intraProfile,
    };
    await this.userService.incrementConnectionCounter(user);
    done(null, requestUser);
  }
}
