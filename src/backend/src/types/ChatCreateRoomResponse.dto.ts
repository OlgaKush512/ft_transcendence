import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatRoomData } from './ChatRoomData.dto';

export class CreateRoomResponseDTO {
  room: ChatRoomData;
}
