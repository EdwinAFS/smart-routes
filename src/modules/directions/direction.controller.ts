import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DirectionService, Route } from './direction.service';
import { OptimizeWaypointsDto } from './dto/optimize-waypoints.dto';

@ApiTags('directions')
@Controller('directions')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post('optimize-waypoints')
  @ApiResponse({
    status: 200,
    description: 'Waypoints optimized successfully',
    schema: {
      type: 'object',
      properties: {
        routes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string', example: 'Cali, Valle del Cauca' },
              to: { type: 'string', example: 'Cali, Valle del Cauca' },
              distance: { type: 'string', example: '100km' },
              duration: { type: 'string', example: '1h' },
            },
          },
        },
        mapsUrl: {
          type: 'string',
          example:
            'https://www.google.com/maps/dir/?api=1&origin=Cali,%20Valle%20del%20Cauca&destination=Cali,%20Valle%20del%20Cauca&waypoints=Cra%2015%20%2313-25%20Cali,Av%206N%20%2323-45%20Cali&travelmode=driving',
        },
      },
    },
  })
  async optimizeWaypoints(
    @Body() optimizeWaypointsDto: OptimizeWaypointsDto,
  ): Promise<{ routes: Route[]; mapsUrl: string }> {
    return this.directionService.optimizeWaypoints(optimizeWaypointsDto);
  }
}
