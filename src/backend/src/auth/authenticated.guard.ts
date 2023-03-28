import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const allowUnauthorizedRequest = this.reflector.get<boolean>('allowUnauthorizedRequest', context.getHandler());
    if (allowUnauthorizedRequest) return true;
    if (!request.isAuthenticated()) throw new ForbiddenException('Missing or Invalid Token');
    if (request.user.twoFactorAuth.isEnabled && !request.user.twoFactorAuth.isAuthorized)
      throw new ForbiddenException('2FA not verified');
    return true;
  }
}
