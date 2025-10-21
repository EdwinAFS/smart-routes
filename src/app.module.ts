import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { User } from './modules/users/entities/user.entity';
import { DeviceToken } from './modules/notifications/entities/device-token.entity';
import { DirectionModule } from './modules/directions/direction.module';
import { OwnTracksModule } from './modules/owntracks/owntracks.module';
import { OwnTracksPayload } from './modules/owntracks/entities/owntracks-payload.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';

// Use /tmp in serverless environments (Lambda/Vercel), local tmp otherwise
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const tmpPath = isServerless
  ? join(tmpdir(), 'smart-routes')
  : join(__dirname, '..', 'tmp');

if (!existsSync(tmpPath)) {
  mkdirSync(tmpPath, { recursive: true });
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(tmpPath, 'smart-routes.db'),
      entities: [User, DeviceToken, OwnTracksPayload],
      synchronize: true,
    }),
    UserModule,
    NotificationModule,
    DirectionModule,
    OwnTracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
