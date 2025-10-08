import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OptimizeWaypointsDto } from './dto/optimize-waypoints.dto';
import { Client } from '@googlemaps/google-maps-services-js';

export interface Route {
  from: string;
  to: string;
  distance: string;
  duration: string;
}

@Injectable()
export class DirectionService implements OnModuleInit {
  private readonly logger = new Logger(DirectionService.name);
  private client: Client;

  onModuleInit() {
    this.client = new Client({});
  }

  async optimizeWaypoints(
    optimizeWaypointsDto: OptimizeWaypointsDto,
  ): Promise<{ routes: Route[]; mapsUrl: string }> {
    const response = await this.client.directions({
      params: {
        origin: optimizeWaypointsDto.origin,
        destination: optimizeWaypointsDto.destination,
        waypoints: optimizeWaypointsDto.waypoints,
        optimize: true,
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    });

    const routes = response.data.routes[0].legs.map((leg) => ({
      from: leg.start_address,
      to: leg.end_address,
      distance: leg.distance.text,
      duration: leg.duration.text,
    }));

    const order = response.data.routes[0].waypoint_order;
    const optimizedWaypoints = order.map(
      (i) => optimizeWaypointsDto.waypoints[i],
    );

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      optimizeWaypointsDto.origin,
    )}&destination=${encodeURIComponent(
      optimizeWaypointsDto.destination,
    )}&waypoints=${optimizedWaypoints
      .map((wp) => encodeURIComponent(wp))
      .join('|')}&travelmode=driving`;

    return { mapsUrl, routes };
  }
}
