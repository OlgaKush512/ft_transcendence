import { UnauthorizedException } from "@nestjs/common";

export class TwoFactorInvalidCodeException extends UnauthorizedException {
    remainingTries: number;
    constructor(remainingTries?: number) {
      super({
        statusCode: 401,
        message: 'Invalid Code',
      });
      this.remainingTries = remainingTries;
    }
  }