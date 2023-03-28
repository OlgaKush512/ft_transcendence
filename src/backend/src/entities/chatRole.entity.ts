import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatMessage from './chatMessage.entity';
import ChatRoom from './chatRoom.entity';
import User from './user.entity';

export enum ChatRoleType {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}

@Entity()
export class ChatRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatRoles)
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.roles)
  room: ChatRoom;

  @Column({ type: 'enum', enum: ChatRoleType })
  role: ChatRoleType;
}

export default ChatRole;
