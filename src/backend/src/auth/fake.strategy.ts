import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { AuthService } from './auth42.service';
import { UsersService } from 'src/users/users.service';
import { IIntraProfile } from 'src/users/IntraProfile.interface';
import { RequestUser } from './RequestUser.interface';
import { TwoFactorAuthService } from '../2fa/TwoFactorAuth.service';

@Injectable()
export class FakeStrategy extends PassportStrategy(Strategy, 'fake') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private authService: AuthService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {
    super();
  }

  async validate(
    req: Request,
    done: (err: any, user: RequestUser) => void,
  ): Promise<any> {
    
    const fakeIntraProfile: IIntraProfile = {
      login: (req.query.login as string) || '',
      displayname: req.query.displayname as string,
      email: req.query.email as string,
      first_name: req.query.first_name as string,
      id: parseInt(req.query.id as string),
      image: { link: `https://cdn.intra.42.fr/users/3710d8a2732390d37aa4207607bba4d0/${req.query.login}.jpg` },
      last_name: req.query.last_name as string,
      url: req.query.url as string,
      usual_full_name: (req.query.usual_full_name as string) || '',
    };
    
    const user = await this.userService.findOrCreateFromIntra(fakeIntraProfile);
    const twoFactorAuth =
      this.twoFactorAuthService.generateInitialRequestUserStatus(user);
    const requestUser: RequestUser = {
      id: user.id,
      twoFactorAuth,
      intraProfile: fakeIntraProfile,
    };
    await this.userService.incrementConnectionCounter(user);
    done(null, requestUser);
  }
}
