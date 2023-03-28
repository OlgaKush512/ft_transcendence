import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class UserRequestFriendResponseDTO {
  @ApiProperty({ enum: ['requested', 'friend'] })
  status: 'requested' | 'friend';
}
