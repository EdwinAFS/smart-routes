import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderPoint } from './entities/order-point.entity';
import { Route } from '../directions/direction.service';
import { TakeOrderDto } from './dto/take-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [Order],
  })
  @Get('driver/:driverName')
  @ApiOperation({ summary: 'Get orders by driver ID' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [Order],
  })
  findByDriver(@Param('driverName') driverName: string): Promise<Order[]> {
    return this.ordersService.findByDriver(driverName);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize route for an order' })
  @ApiResponse({
    status: 200,
    description: 'Route optimized successfully',
    type: [OrderPoint],
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  optimizeRoute(
    @Param('id', ParseIntPipe) id: number,
    @Body() takeOrderDto: TakeOrderDto,
  ): Promise<{ mapsUrl: string; routes: Route[] }> {
    return this.ordersService.optimizeRoute(id, takeOrderDto);
  }
}
