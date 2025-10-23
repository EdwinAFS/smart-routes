import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderPoint } from './entities/order-point.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Client } from '@googlemaps/google-maps-services-js';
import { Route } from '../directions/direction.service';
import { TakeOrderDto } from './dto/take-order.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  private client: Client;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderPoint)
    private orderPointRepository: Repository<OrderPoint>,
  ) {}

  onModuleInit() {
    this.client = new Client({});
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderPoints, ...orderData } = createOrderDto;

    const existingOrder = await this.orderRepository.findOne({
      where: {
        driverName: orderData.driverName,
        status: OrderStatus.PENDING,
      },
      relations: ['orderPoints'],
    });

    if (existingOrder) {
      await this.remove(existingOrder);
    }

    // Create the order
    const order = this.orderRepository.create({
      ...orderData,
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.orderRepository.save(order);

    // Create the order points
    const orderPointsToCreate = orderPoints.map((point, index) =>
      this.orderPointRepository.create({
        originalIndex: index,
        lat: 0,
        lng: 0,
        ...point,
        orderId: savedOrder.id,
      }),
    );

    savedOrder.orderPoints =
      await this.orderPointRepository.save(orderPointsToCreate);

    return savedOrder;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderPoints'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByDriver(driverName: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { driverName },
      relations: ['orderPoints'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async optimizeRoute(
    driverName: string,
    takeOrderDto: TakeOrderDto,
  ): Promise<{ mapsUrl: string; routes: Route[] }> {
    const order = await this.orderRepository.findOne({
      where: { driverName, status: OrderStatus.PENDING },
      relations: ['orderPoints'],
    });

    if (!order) {
      throw new NotFoundException(
        `Order with driver name ${driverName} not found`,
      );
    }

    const response = await this.client.directions({
      params: {
        origin: `${takeOrderDto.startLat},${takeOrderDto.startLng}`,
        destination: 'Cali, Valle del Cauca',
        waypoints: order.orderPoints.map((point) => point.address),
        optimize: true,
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    });

    await this.orderPointRepository.save(
      order.orderPoints.map((point) => {
        return {
          id: point.id,
          originalIndex:
            response.data.routes[0].waypoint_order[point.originalIndex],
        };
      }),
    );

    const routes = response.data.routes[0].legs.map((leg) => ({
      from: leg.start_address,
      to: leg.end_address,
      distance: leg.distance.text,
      duration: leg.duration.text,
    }));

    const orderWaypoints = response.data.routes[0].waypoint_order;
    const optimizedWaypoints = orderWaypoints.map((i) => order.orderPoints[i]);

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      `${takeOrderDto.startLat},${takeOrderDto.startLng}`,
    )}&destination=${encodeURIComponent(
      'Cali, Valle del Cauca',
    )}&waypoints=${optimizedWaypoints
      .map((wp) => encodeURIComponent(wp.address))
      .join('|')}&travelmode=driving`;

    return { mapsUrl, routes };
  }

  async remove(order: Order): Promise<void> {
    await this.orderPointRepository.remove(order.orderPoints);
    await this.orderRepository.delete(order.id);
  }
}
