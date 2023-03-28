import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export enum MuteTime {
  ThirtySeconds = '30s',
  FiveMinutes = '5m',
  OneHour = '1h',
}

export class MuteRequestDTO {
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @IsNotEmpty()
  userId: number;
  // @ApiProperty({ type: 'enum', enum: MuteTime })
  @IsNotEmpty()
  @IsEnum(MuteTime)
  time: MuteTime;
}
