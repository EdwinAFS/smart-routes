import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('device_tokens')
export class DeviceToken {
  @ApiProperty({
    description: 'Auto-generated ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'FCM token from the device',
    example: 'eXd1234567890abcdef...',
  })
  @Column({ type: 'text', unique: true })
  token: string;

  @ApiProperty({
    description: 'When the token was registered',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
