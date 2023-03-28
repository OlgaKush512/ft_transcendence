import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BlockedAccount {
  @PrimaryColumn()
  userId: number;

  @CreateDateColumn()
  from: Date;

  @Column({ type: 'timestamptz' })
  until: Date;
}

export default BlockedAccount;
