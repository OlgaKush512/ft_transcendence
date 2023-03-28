import { UnauthorizedException } from "@nestjs/common";

export class TwoFactorAuthAccountBlockedException extends UnauthorizedException {
    until: Date;
    constructor(until?: Date) {
      super({
        statusCode: 401,
        message: 'Account Blocked',
      });
      this.until = until;
    }
  }