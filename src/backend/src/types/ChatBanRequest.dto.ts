import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class BanRequestDTO {
  @IsString()
  roomId: string;
  @IsNumber()
  @Type(() => Number)
  userId: number;
}
