import { ChatRoleType } from 'src/entities/chatRole.entity';

export class ChatRoomUserDTO {
  id: number;
  username: string;
  role: ChatRoleType;
  imageUrl: string;
  muted: boolean;
  inGame: boolean;
  gameId: string | null;
}
