import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class UserGetProfileResponseDTO {
  initialized: boolean;
  username: string;
  firstName: string;
  lastName: string;
  login: string;
  imageUrl: string;
  stats: any;
  gameHistory: any;
  isFriend: boolean;
  isRequested: boolean;
  isBlocked: boolean;
  rank: number;
  twoFactorAuthEnabled: boolean;
  achievements: any;
}
