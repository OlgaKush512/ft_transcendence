import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatRoomData } from './ChatRoomData.dto';

export class GetRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
