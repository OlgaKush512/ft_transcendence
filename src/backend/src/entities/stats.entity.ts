import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.chatRoles)
  user: User;

  @Column({ default: 0 })
  played: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  loses: number;

  @Column({ default: 0 })
  points: number;
}

export default Stats;
