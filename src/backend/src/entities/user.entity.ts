import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import FriendRequest from './friendRequest.entity';
import ChatRoom from './chatRoom.entity';
import ChatRole from './chatRole.entity';
import Notification from './notification.entity';
import Stats from './stats.entity';
import Game from './game.entity';
import Achievements from './achievements.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  username: string;

  @Column({
    nullable: false,
  })
  login: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    name: 'intra_id',
  })
  intraId: number;

  @Column({
    default: 0,
  })
  connectionCounter: number;

  @Column({
    default: false,
    nullable: true,
  })
  isTwoFactorAuthEnabled: boolean;

  @Column({
    name: 'image_url',
    nullable: true,
  })
  imageUrl: string;

  @Column({
    default: false,
  })
  isInitialized: boolean;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.creator)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @ManyToMany(() => ChatRoom)
  @JoinTable()
  chatRooms: ChatRoom[];

  @OneToMany(() => ChatRole, (chatRole) => chatRole.user)
  chatRoles: ChatRole[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.banned)
  bannedFrom: ChatRoom[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToOne(() => Stats, (stats) => stats.user, { cascade: true })
  @JoinColumn()
  stats: Stats;

  @OneToOne(() => Achievements, (achievements) => achievements.user, {
    cascade: true,
  })
  @JoinColumn()
  achievements: Achievements;

  @OneToMany(() => Game, (game) => game.player1)
  gamesAsPlayer1: Game;

  @OneToMany(() => Game, (game) => game.player2)
  gamesAsPlayer2: Game;
}

export default User;
