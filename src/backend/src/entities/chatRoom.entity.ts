import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatMessage from './chatMessage.entity';
import ChatRole from './chatRole.entity';
import User from './user.entity';

export enum ChatRoomType {
  Public = 'public',
  Private = 'private',
  Protected = 'protected',
}

@Entity()
export class ChatRoom {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: ChatRoomType })
  type: ChatRoomType;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @OneToMany(() => ChatRole, (chatRole) => chatRole.room, { cascade: true })
  roles: ChatRole[];

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];

  @OneToMany(() => User, (user) => user.bannedFrom)
  banned: User[];
}

export default ChatRoom;
