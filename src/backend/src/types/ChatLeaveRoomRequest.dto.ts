import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LeaveRoomRequestDTO {
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
