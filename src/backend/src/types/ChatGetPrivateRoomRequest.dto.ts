import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatMessageDTO } from './ChatMessage.dto';
import { ChatRoomData } from './ChatRoomData.dto';
import { ChatRoomUserDTO } from './ChatRoomUser.dto';

export class GetPrivateRoomRequestDTO {
  @IsString()
  @IsNotEmpty()
  user: string;
}
