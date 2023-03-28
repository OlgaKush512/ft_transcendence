import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ChatRoomType } from 'src/entities/chatRoom.entity';

export class CreateRoomRequestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'enum', enum: ChatRoomType })
  @IsEnum(ChatRoomType)
  type: ChatRoomType;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  password: string;
}
