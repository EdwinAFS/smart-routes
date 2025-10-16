import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnTracksController } from './owntracks.controller';
import { OwnTracksService } from './owntracks.service';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OwnTracksPayload])],
  controllers: [OwnTracksController],
  providers: [OwnTracksService],
  exports: [OwnTracksService],
})
export class OwnTracksModule {}
