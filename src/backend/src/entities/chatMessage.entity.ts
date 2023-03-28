import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatRoom from './chatRoom.entity';
import User from './user.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  room: ChatRoom;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  sentAt: Date;

  @ManyToOne(() => User)
  user: User;

  @Column('jsonb', { nullable: false, default: [], name: 'seen_by' })
  seenBy: any;
}

export default ChatMessage;
