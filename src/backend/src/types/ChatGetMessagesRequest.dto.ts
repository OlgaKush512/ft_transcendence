import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatRoomData } from './ChatRoomData.dto';
import { Type } from 'class-transformer';

export class GetMessagesRequestDTO {
  @IsString()
  @IsNotEmpty()
  roomId: string;
  @IsNumber()
  @Type(() => Number)
  page: number;
}
