import { IsOptional } from 'class-validator';
import { ChatMessageDTO } from './ChatMessage.dto';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

export class ChatRoomData {
  name: string;
  id: string;
  lastMessage: ChatMessageDTO | null;
  unreadMessages: number;
  @ApiProperty({ type: 'enum', enum: ['private', 'public', 'protected'] })
  type: 'private' | 'public' | 'protected';
}
