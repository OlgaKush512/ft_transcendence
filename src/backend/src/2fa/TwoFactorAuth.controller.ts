import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth42.service';
import { Request } from 'express';
import { RequestUser } from '../auth/RequestUser.interface';
import { TwoFactorAuthGuard } from './TwoFactorAuth.guard';
import { TwoFactorAuthService } from './TwoFactorAuth.service';
import { TwoFactorAuthVerifyCodeDTO } from './TwoFactorAuthVerifyCode.dto';
import { AllowUnauthorizedRequest } from 'src/AllowUnauthorizedRequest';
import { UsersService } from 'src/users/users.service';
import {
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TwoFactorAuthVerifyCodeResponseDTO } from 'src/types/TwoFactorAuthVerifyCodeResponse.dto';

@Controller('api/auth/2fa')
export class TwoFactorAuthController {
  constructor(
    private twoFactorAuthService: TwoFactorAuthService,
    private userService: UsersService,
  ) {}

  @Post('verify')
  @AllowUnauthorizedRequest()
  @UseGuards(TwoFactorAuthGuard)
  async verify(
    @Req() req: Request,
    @Body() body: TwoFactorAuthVerifyCodeDTO,
  ): Promise<TwoFactorAuthVerifyCodeResponseDTO> {
    
    return await this.twoFactorAuthService.verifyCode(req, body);
  }

  @Post('resend-code')
  @AllowUnauthorizedRequest()
  @UseGuards(TwoFactorAuthGuard)
  async resendCode(@Req() req: Request) {
    req.user.twoFactorAuth.code = this.twoFactorAuthService.generateCode();
    this.twoFactorAuthService.sendCodeByEmail(
      req.user.id,
      req.user.twoFactorAuth.code.value,
    );
  }

  @Get('status')
  @AllowUnauthorizedRequest()
  @UseGuards(TwoFactorAuthGuard)
  async getStatus(@Req() req: Request) {
    return await this.twoFactorAuthService.getUserStatus(req);
  }
}
