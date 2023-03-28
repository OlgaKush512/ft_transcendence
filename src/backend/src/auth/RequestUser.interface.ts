import User from 'src/entities/user.entity';
import { IIntraProfile } from 'src/users/IntraProfile.interface';

export interface ITwoFactorAuthRequestUserStatus {
  isEnabled: boolean;
  isAuthorized?: boolean;
  code?: { value: string; expiresAt: Date };
  remainingTries?: number;
}

export interface RequestUser {
  id: number;
  twoFactorAuth: ITwoFactorAuthRequestUserStatus;
  intraProfile: IIntraProfile;
}

declare global {
  namespace Express {
    interface User extends RequestUser {}
  }
}
