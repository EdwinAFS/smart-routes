import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderPoint } from './order-point.entity';

export enum OrderStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the driver assigned to this order',
    example: 'John-Doe',
  })
  @Column({ name: 'driver_name', nullable: true })
  driverName: string;

  @ApiProperty({
    description: 'Latitude of the start location',
    example: 40.7128,
  })
  @Column({ name: 'start_lat', type: 'decimal', precision: 10, scale: 8 })
  startLat: number;

  @ApiProperty({
    description: 'Longitude of the start location',
    example: -74.006,
  })
  @Column({ name: 'start_lng', type: 'decimal', precision: 11, scale: 8 })
  startLng: number;

  @ApiProperty({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Date when the order was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderPoint, (orderPoint) => orderPoint.order)
  orderPoints: OrderPoint[];
}
