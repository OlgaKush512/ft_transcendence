import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SendInvitationRequestDTO {
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ type: 'enum', enum: ['classic', 'bonus'] })
  @IsIn(['classic', 'bonus'])
  gameType: 'classic' | 'bonus';
}
