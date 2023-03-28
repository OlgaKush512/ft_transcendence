import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChatRoleType } from 'src/entities/chatRole.entity';

export class ChatUpdateRoleRequestDTO {
  @IsString()
  @IsNotEmpty()
  roomId: string;
  @IsNumber()
  @Type(() => Number)
  userId: number;
  @IsEnum(ChatRoleType)
  role: ChatRoleType;
}
