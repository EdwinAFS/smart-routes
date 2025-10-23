import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.ASSIGNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class UpdateOrderPointDto {
  @ApiProperty({
    description: 'Optimized index after route optimization',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  optimizedIndex?: number;

  @ApiProperty({
    description: 'Whether this point has been visited',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  visited?: boolean;

  @ApiProperty({
    description: 'Date when the point was visited',
    example: '2024-01-15T14:30:00.000Z',
    required: false,
  })
  @IsOptional()
  visitedAt?: Date;
}
