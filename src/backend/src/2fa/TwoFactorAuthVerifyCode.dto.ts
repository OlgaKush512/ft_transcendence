import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TwoFactorAuthVerifyCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(4)
  code: string;
}
