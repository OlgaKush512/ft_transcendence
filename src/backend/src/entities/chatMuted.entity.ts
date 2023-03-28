import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ChatRoom from './chatRoom.entity';
import User from './user.entity';

@Entity()
export class ChatMuted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  room: ChatRoom;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  until: Date;
}

export default ChatMuted;
