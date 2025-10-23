import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('order_points')
export class OrderPoint {
  @ApiProperty({
    description: 'Unique identifier for the order point',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID of the order this point belongs to',
    example: 1,
  })
  @Column({ name: 'order_id' })
  orderId: number;

  @ApiProperty({
    description: 'Original index of the point in the order sequence',
    example: 1,
  })
  @Column({ name: 'original_index' })
  originalIndex: number;

  @ApiProperty({
    description: 'Address of the order point',
    example: [
      {
        address: 'Cl. 13 #80 - 187, Pasoancho, Cali, Valle del Cauca',
      },
      {
        address: 'Cl. 42 #80-01, Comuna 17, Cali, Valle del Cauca',
      },
      {
        address:
          'Quintas de Don Simon - Cra 80, 80 #13A #261 13A 261Carrera, Cali, Valle del Cauca',
      },
      {
        address: 'Cra. 66 #1c-87, La Cascada, Cali, Valle del Cauca',
      },
    ],
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Latitude of the order point',
    example: 40.7128,
  })
  @Column({ name: 'lat', type: 'decimal', precision: 10, scale: 8 })
  lat: number;

  @ApiProperty({
    description: 'Longitude of the order point',
    example: -74.006,
  })
  @Column({ name: 'lng', type: 'decimal', precision: 11, scale: 8 })
  lng: number;

  @ApiProperty({
    description:
      'Optimized index after route optimization (nullable until optimized)',
    example: 2,
    nullable: true,
  })
  @Column({ name: 'optimized_index', nullable: true })
  optimizedIndex: number;

  @ApiProperty({
    description: 'Whether this point has been visited',
    example: false,
  })
  @Column({ default: false })
  visited: boolean;

  @ApiProperty({
    description: 'Date when the point was visited (nullable if not visited)',
    example: '2024-01-15T14:30:00.000Z',
    nullable: true,
  })
  @Column({ name: 'visited_at', nullable: true })
  visitedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderPoints)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
