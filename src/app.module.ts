import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { User } from './modules/users/entities/user.entity';
import { DeviceToken } from './modules/notifications/entities/device-token.entity';
import { DirectionModule } from './modules/directions/direction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '/tmp/smart-routes.db',
      entities: [User, DeviceToken],
      synchronize: true,
    }),
    UserModule,
    NotificationModule,
    DirectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
