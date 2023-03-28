import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthVerifyCodeDTO } from './TwoFactorAuthVerifyCode.dto';
import User from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Blocked from 'src/entities/blockedAccount.entity';
import { TwoFactorAuthVerifyCodeResponseDTO } from 'src/types/TwoFactorAuthVerifyCodeResponse.dto';
import {
  ITwoFactorAuthRequestUserStatus,
  RequestUser,
} from 'src/auth/RequestUser.interface';

@Injectable()
export class TwoFactorAuthService {
  // Number of invalid tries before the account is blocked
  MAX_INVALID_TRIES = 5;
  // Duration of the account ban in seconds
  BLOCK_TIME = 60;
  // Code expiration time in seconds
  CODE_EXPIRATION_TIME = 300;

  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    @InjectRepository(Blocked)
    private readonly blockedRepository: Repository<Blocked>,
  ) {}

  generateCode() {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + this.CODE_EXPIRATION_TIME * 1000);
    return {
      value: Math.floor(1000 + Math.random() * 9000).toString(),
      expiresAt,
    };
  }

  generateInitialRequestUserStatus(user: User) {
    const twoFactorAuth: ITwoFactorAuthRequestUserStatus = {
      isEnabled: user.isTwoFactorAuthEnabled,
      isAuthorized: user.isTwoFactorAuthEnabled ? false : null,
      code: user.isTwoFactorAuthEnabled ? this.generateCode() : null,
      remainingTries: user.isTwoFactorAuthEnabled
        ? this.MAX_INVALID_TRIES
        : null,
    };
    return twoFactorAuth;
  }

  async sendCodeByEmail(userId: number, code: string) {
    const user = await this.usersService.findOneById(userId);
    await this.mailerService.sendMail({
      to: user.email,
      from: '"No Reply" <noreply@example.com>',
      subject: 'Transcendence App - 2FA',
      template: './confirmation',
      context: {
        name: user.username,
        code,
      },
    });
  }

  async verifyCode(
    req: Request,
    body: TwoFactorAuthVerifyCodeDTO,
  ): Promise<TwoFactorAuthVerifyCodeResponseDTO> {
    let blocked = await this.isUserBlocked(req);
    if (blocked) {
      return { status: 'ko', error: 'Account Blocked', until: blocked.until };
    }
    
    if (new Date() > req.user.twoFactorAuth.code.expiresAt) {
      req.user.twoFactorAuth.code = this.generateCode();
      this.sendCodeByEmail(req.user.id, req.user.twoFactorAuth.code.value);
      return { status: 'ko', error: 'Code Expired' };
    }
    if (req.user.twoFactorAuth.code.value === body.code) {
      req.user.twoFactorAuth.isAuthorized = true;
      return { status: 'ok' };
    }

    req.user.twoFactorAuth.remainingTries -= 1;
    if (req.user.twoFactorAuth.remainingTries <= 0) {
      blocked = await this.blockUser(req.user.id, this.BLOCK_TIME);
      req.session.destroy(null);
      return { status: 'ko', error: 'Account Blocked', until: blocked.until };
    }

    return {
      status: 'ko',
      error: 'Invalid Code',
      triesLeft: req.user.twoFactorAuth.remainingTries,
    };
  }

  async blockUser(userId: number, time_in_s: number) {
    
    let until = new Date();
    until.setTime(until.getTime() + time_in_s * 1000);
    const newBlockedUser = this.blockedRepository.create({
      userId,
      until,
    });
    return await this.blockedRepository.save(newBlockedUser);
  }

  async isUserBlocked(req: Request) {
    const blocked = await this.blockedRepository.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!blocked) return null;

    if (new Date() < blocked.until) {
      return blocked;
    } else {
      this.blockedRepository.remove(blocked);
      req.user.twoFactorAuth.remainingTries = this.MAX_INVALID_TRIES;
    }
    return null;
  }

  async getUserStatus(req: Request) {
    const user = await this.usersService.findOneByIdOrThrow(req.user.id);
    if (!user.isInitialized) return { status: 'Uninitialized' };
    if (
      !req.user.twoFactorAuth.isEnabled ||
      (req.user.twoFactorAuth.isEnabled && req.user.twoFactorAuth.isAuthorized)
    )
      return { status: 'Authorized' };
    if (req.user.twoFactorAuth.isEnabled && (await this.isUserBlocked(req)))
      return { status: 'Blocked' };
    if (req.user.twoFactorAuth.isEnabled) return { status: 'Pending' };
  }
}
