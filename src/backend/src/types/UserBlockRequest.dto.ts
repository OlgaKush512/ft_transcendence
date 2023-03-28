import { IsNotEmpty, IsString } from 'class-validator';

export class UserBlockRequestDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}
