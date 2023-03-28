import { ChatRoleType } from 'src/entities/chatRole.entity';
import { ChatRoomType } from 'src/entities/chatRoom.entity';
import { ChatMessageDTO } from './ChatMessage.dto';
import { ChatRoomUserDTO } from './ChatRoomUser.dto';

export class GetRoomResponseDTO {
  type: ChatRoomType;
  username: string;
  id: string;
  name: string;
  createdAt: Date;
  users: ChatRoomUserDTO[];
  messages: ChatMessageDTO[];
  hasMoreMessages: boolean;
  role: ChatRoleType;
  muted: boolean;
  banned: any[];
}
