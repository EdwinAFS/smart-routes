import { Controller, Post, Body, Headers, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OwnTracksService } from './owntracks.service';

@ApiTags('owntracks')
@Controller('owntracks')
export class OwnTracksController {
  constructor(private readonly ownTracksService: OwnTracksService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Receive OwnTracks location data' })
  @ApiResponse({
    status: 201,
    description: 'Data received and stored successfully',
  })
  async receiveData(
    @Body() payload: any,
    @Headers('user-agent') userAgent?: string,
  ) {
    const saved = await this.ownTracksService.savePayload(payload, userAgent);
    return {
      success: true,
      message: 'Data received and stored',
      id: saved.id,
      receivedAt: saved.receivedAt,
    };
  }

  @Get('payloads')
  @ApiOperation({ summary: 'Get all received payloads' })
  @ApiResponse({ status: 200, description: 'List of all payloads' })
  async getAllPayloads(): Promise<any> {
    return this.ownTracksService.getAllPayloads();
  }

  @Get('tracker-status')
  @ApiOperation({
    summary: 'Check if a device has sent data in the last 30 seconds',
  })
  @ApiQuery({
    name: 'deviceId',
    required: true,
    description: 'The device ID to check status for',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Tracker status information',
    schema: {
      type: 'object',
      properties: {
        isActive: {
          type: 'boolean',
          description:
            'Whether the device has sent data in the last 30 seconds',
        },
        deviceId: {
          type: 'string',
          description: 'The device ID',
        },
        lastUpdate: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp of the last update',
          nullable: true,
        },
        secondsSinceLastUpdate: {
          type: 'number',
          description: 'Seconds since the last update',
          nullable: true,
        },
      },
    },
  })
  async getTrackerStatus(@Query('deviceId') deviceId: string) {
    return this.ownTracksService.getTrackerStatus(deviceId);
  }
}
