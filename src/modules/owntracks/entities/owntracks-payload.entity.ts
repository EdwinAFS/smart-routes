import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('owntracks_payloads')
export class OwnTracksPayload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  payload: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  receivedAt: Date;
}
