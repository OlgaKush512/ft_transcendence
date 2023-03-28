import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatMessageDTO } from './ChatMessage.dto';
import { ChatRoomData } from './ChatRoomData.dto';
import { ChatRoomUserDTO } from './ChatRoomUser.dto';

export class GetMessagesResponseDTO {
  messages: ChatMessageDTO[];
  hasMore: boolean;
}
