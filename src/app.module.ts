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
import { ConfigModule } from '@nestjs/config';

// Determine the appropriate path for temporary/database files based on environment
// - Serverless (Vercel/Lambda): Use system /tmp (ephemeral)
// - Railway: Use /data volume if mounted, otherwise local tmp
// - Local development: Use local tmp directory
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const isRailway = process.env.RAILWAY_ENVIRONMENT;

let tmpPath: string;
if (isServerless) {
  tmpPath = join(tmpdir(), 'smart-routes');
} else if (isRailway && existsSync('/data')) {
  // Railway with mounted volume
  tmpPath = '/data';
} else {
  // Local development or Railway without volume
  tmpPath = join(__dirname, '..', 'tmp');
}

if (!existsSync(tmpPath)) {
  mkdirSync(tmpPath, { recursive: true });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',

      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      host: process.env.DATABASE_HOST,
      ssl: process.env.DATABASE_SSL === 'true',

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
