import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
export class Achievements {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.achievements)
  user: User;

  @Column({ default: false })
  achievement1: boolean;

  @Column({ default: false })
  achievement2: boolean;

  @Column({ default: false })
  achievement3: boolean;

  @Column({ default: false })
  achievement4: boolean;

  @Column({ default: false })
  achievement5: boolean;

  @Column({ default: false })
  achievement6: boolean;

  @Column({ default: false })
  achievement7: boolean;

  @Column({ default: false })
  achievement8: boolean;

  @Column({ default: false })
  achievement9: boolean;
}

export default Achievements;
