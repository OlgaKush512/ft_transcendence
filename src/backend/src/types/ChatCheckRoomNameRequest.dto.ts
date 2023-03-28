import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CheckRoomNameRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
