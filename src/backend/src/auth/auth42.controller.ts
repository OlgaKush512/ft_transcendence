import {
  Controller,
  Get,
  UseGuards,
  Req,
  Session,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth42.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './authenticated.guard';
import { IntraAuthGuard } from './intra-auth.guard';
import { RequestUser } from './RequestUser.interface';
import { UsersService } from 'src/users/users.service';
import { CreateFakeUserRequestDTO } from '../types/CreateFakeUserRequest.dto';
import { FakeAuthGuard } from './fake-auth.guard';
import { TwoFactorAuthService } from '../2fa/TwoFactorAuth.service';
import { AllowUnauthorizedRequest } from 'src/AllowUnauthorizedRequest';
import User from 'src/entities/user.entity';
import { ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { LoginFakeUserRequestDTO } from 'src/types/loginFakeUserRequest.dto';
import { ConfigService } from '@nestjs/config';

@ApiInternalServerErrorResponse()
@Controller('api/auth/42')
export class Auth42Controller {
  constructor(
    private authService: AuthService,
    private twoFactorAuthService: TwoFactorAuthService,
    private configService: ConfigService
  ) {}

  @Get('login')
  @AllowUnauthorizedRequest()
  @UseGuards(IntraAuthGuard)
  async intraAuth() {}

  @Get('callback')
  @AllowUnauthorizedRequest()
  @UseGuards(IntraAuthGuard)
  async intraAuthRedirect(@Req() req: Request, @Res() res: Response) {
    
    if (
      req.user.twoFactorAuth.isEnabled &&
      !(await this.twoFactorAuthService.isUserBlocked(req))
    ) {
      this.twoFactorAuthService.sendCodeByEmail(
        req.user.id,
        req.user.twoFactorAuth.code.value,
      );
    }
    res.redirect(`http://localhost:${this.configService.get('CLIENT_PORT')}/redirect`);
  }

  @Get('protected')
  @UseGuards(AuthenticatedGuard)
  async protected(@Req() req: Request) {
    
    return req.user;
  }

  @Get('create-fake-user')
  @AllowUnauthorizedRequest()
  @UseGuards(FakeAuthGuard)
  async createFakeUser(
    @Req() req: Request,
    @Query() query: CreateFakeUserRequestDTO,
  ) {
    
  }

  @Get('login-fake')
  @AllowUnauthorizedRequest()
  @UseGuards(FakeAuthGuard)
  async loginFakeUser(
    @Req() req: Request,
    @Query() query: LoginFakeUserRequestDTO,
  ) {
    
  }

  @Get('sign-out')
  @UseGuards(AuthenticatedGuard)
  async disconnect(@Req() req: Request) {
    await this.authService.disconnect(req);
    
    return { status: 'ok' };
  }

  // @Get('status')
  // async userStatus(@Req() req: Request) {
  //   await this.authService.disconnect(req);
  //   return { status: 'ok' };
  // }
}
