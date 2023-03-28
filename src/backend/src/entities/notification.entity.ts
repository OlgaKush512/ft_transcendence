import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

export enum NotificationType {
  FriendRequestReceived = 'friend_request_received',
  FriendRequestAccepted = 'friend_request_accepted',
  FriendRequestRejected = 'friend_request_rejected',
  GameInvitationReceived = 'game_invitation_received',
  NewAchievement = 'new_achievement',
  NewMessage = 'new_message',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  date: Date;

  @Column('jsonb', { nullable: false, default: {} })
  content: string;

  @Column({ default: false })
  isRead: boolean;
}

export default Notification;
