import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UnmuteRequestDTO {
  @IsString()
  @IsNotEmpty()
  roomId: string;
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
