import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ChatRoom from './chatRoom.entity';
import User from './user.entity';

@Entity()
export class ChatBanned {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  room: ChatRoom;

  @ManyToOne(() => User)
  user: User;
}

export default ChatBanned;
