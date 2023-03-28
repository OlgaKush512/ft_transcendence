import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';

export class UserRequestFriendRequestDTO {
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9_]*$/)
  @ApiProperty({ example: 'sev' })
  username: string;
}
