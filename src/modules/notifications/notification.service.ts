import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from './dto/send-notification.dto';
import { RegisterTokenDto } from './dto/register-token.dto';
import { DeviceToken } from './entities/device-token.entity';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  onModuleInit() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      try {
        if (process.env.FIREBASE_CREDENTIALS_JSON) {
          const serviceAccount = JSON.parse(
            process.env.FIREBASE_CREDENTIALS_JSON,
          ) as admin.ServiceAccount;
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } else {
          this.logger.warn(
            'No Firebase credentials provided. Set FIREBASE_CREDENTIALS_JSON environment variable.',
          );
        }
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin:', error);
      }
    }
  }

  /**
   * Send a notification to one or multiple devices
   * The PWA should pass the FCM tokens directly in the request
   */
  async sendNotification(sendNotificationDto: SendNotificationDto): Promise<{
    success: boolean;
    message: string;
    successCount: number;
    failureCount: number;
    errors?: Array<{ token: string; error: string }>;
  }> {
    const { title, body, tokens, imageUrl, data } = sendNotificationDto;

    // Normalize tokens to array
    let tokenArray: string[] = [];
    if (tokens) {
      tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    }

    if (tokenArray.length === 0) {
      throw new BadRequestException(
        'At least one FCM token is required. The PWA should send the token(s) in the request.',
      );
    }

    // Prepare the message
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      data: data ? this.convertDataToStrings(data) : {},
      tokens: tokenArray,
    };

    try {
      // Send the notification
      const response = await admin.messaging().sendEachForMulticast(message);

      // Log results
      this.logger.log(
        `Successfully sent ${response.successCount} notifications out of ${tokenArray.length}`,
      );

      // Collect errors for debugging
      const errors: Array<{ token: string; error: string }> = [];
      if (response.failureCount > 0) {
        this.logger.warn(
          `Failed to send ${response.failureCount} notifications`,
        );

        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error) {
            const errorMsg = `${resp.error.code}: ${resp.error.message}`;
            errors.push({
              token: tokenArray[idx].substring(0, 20) + '...',
              error: errorMsg,
            });
            this.logger.warn(
              `Failed to send to token ${tokenArray[idx].substring(0, 20)}...: ${errorMsg}`,
            );
          }
        });
      }

      return {
        success: response.successCount > 0,
        message: `Sent to ${response.successCount} device(s), failed: ${response.failureCount}`,
        successCount: response.successCount,
        failureCount: response.failureCount,
        ...(errors.length > 0 && { errors }),
      };
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Convert data object to strings (FCM requirement)
   */
  private convertDataToStrings(
    data: Record<string, any>,
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = String(value);
    }
    return result;
  }

  async registerToken(
    registerTokenDto: RegisterTokenDto,
  ): Promise<DeviceToken> {
    const { token } = registerTokenDto;

    // Check if token already exists
    const existingToken = await this.deviceTokenRepository.findOne({
      where: { token },
    });

    if (existingToken) {
      this.logger.log(`Token already registered: ${token.substring(0, 20)}...`);
      return existingToken;
    }

    // Create new token
    const deviceToken = this.deviceTokenRepository.create({ token });
    await this.deviceTokenRepository.save(deviceToken);
    this.logger.log(`Registered new token: ${token.substring(0, 20)}...`);

    return deviceToken;
  }

  /**
   * Get all registered device tokens
   * Useful for getting tokens to use in send notification endpoint
   */
  async getAllTokens(): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

