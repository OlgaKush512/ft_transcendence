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

export type GameStatus = 'in game' | 'finished' | 'canceled';

@Entity()
export class Game {
  @PrimaryColumn()
  id: string;

  @Column()
  status: GameStatus;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer2)
  player2: User;

  @Column({ nullable: true })
  winnerId: number;

  @Column({ default: 0 })
  player1Score: number;

  @Column({ default: 0 })
  player2Score: number;
}

export default Game;
