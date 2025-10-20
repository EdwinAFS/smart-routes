import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnTracksController } from './owntracks.controller';
import { OwnTracksService } from './owntracks.service';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';
import { LocationGateway } from './location.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([OwnTracksPayload])],
  controllers: [OwnTracksController],
  providers: [OwnTracksService, LocationGateway],
  exports: [OwnTracksService, LocationGateway],
})
export class OwnTracksModule {}
