import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { RegisterTokenDto } from './dto/register-token.dto';
import { DeviceToken } from './entities/device-token.entity';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a device token (for testing)',
    description:
      'Register a FCM token in the database. Useful for testing in Swagger - register your token here, then copy it to use in the send endpoint.',
  })
  @ApiBody({ type: RegisterTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Token registered successfully',
    type: DeviceToken,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
  })
  async registerToken(@Body() registerTokenDto: RegisterTokenDto) {
    return this.notificationService.registerToken(registerTokenDto);
  }

  @Get('devices')
  @ApiOperation({
    summary: 'List all registered tokens',
    description:
      'Get all registered FCM tokens. Copy a token from here to use in the send notification endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of registered tokens',
    type: [DeviceToken],
  })
  async getAllTokens(): Promise<DeviceToken[]> {
    return this.notificationService.getAllTokens();
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a push notification',
    description:
      'Send a push notification to one or multiple devices. You can get tokens from the /devices endpoint or register a new one in /register.',
  })
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Sent to 5 device(s), failed: 0' },
        successCount: { type: 'number', example: 5 },
        failureCount: { type: 'number', example: 0 },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eXd1234567890abcdef...' },
              error: {
                type: 'string',
                example: 'messaging/invalid-registration-token',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or missing FCM tokens',
  })
  @ApiResponse({
    status: 500,
    description: 'Error sending notification',
  })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationService.sendNotification(sendNotificationDto);
  }
}

