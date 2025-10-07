import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { DeviceToken } from './device-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '/tmp/smart-routes.db',
      entities: [User, DeviceToken],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, DeviceToken]),
  ],
  controllers: [AppController, UserController, NotificationController],
  providers: [AppService, UserService, NotificationService],
})
export class AppModule {}
