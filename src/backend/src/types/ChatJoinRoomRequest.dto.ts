import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class JoinRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  roomName: string;

  @IsOptional()
  password: string;
}
