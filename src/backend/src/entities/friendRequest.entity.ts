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

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: FriendRequestStatus;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  creator: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  receiver: User;
}

export default FriendRequest;
