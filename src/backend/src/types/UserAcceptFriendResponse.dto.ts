import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class UserAcceptFriendResponseDTO {
  @ApiProperty()
  status: 'ok';
}
