import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  async getAllPayloads() {
    return this.ownTracksService.getAllPayloads();
  }
}
