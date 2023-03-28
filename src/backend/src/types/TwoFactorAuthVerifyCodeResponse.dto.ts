import { ApiProperty } from '@nestjs/swagger';

export class TwoFactorAuthVerifyCodeResponseDTO {
  @ApiProperty({ enum: ['ok', 'ko'] })
  status: 'ok' | 'ko';

  @ApiProperty({ enum: ['Invalid Code', 'Account Blocked', 'Code Expired'] })
  error?: 'Invalid Code' | 'Account Blocked' | 'Code Expired';

  until?: Date;
  triesLeft?: number;
}
