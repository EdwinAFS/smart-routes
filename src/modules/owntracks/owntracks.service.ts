import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';

@Injectable()
export class OwnTracksService {
  constructor(
    @InjectRepository(OwnTracksPayload)
    private ownTracksPayloadRepository: Repository<OwnTracksPayload>,
  ) {}

  async savePayload(
    payload: any,
    userAgent?: string,
  ): Promise<OwnTracksPayload> {
    const ownTracksPayload = new OwnTracksPayload();
    ownTracksPayload.payload = JSON.stringify(payload, null, 2);
    ownTracksPayload.userAgent = userAgent || '';

    return this.ownTracksPayloadRepository.save(ownTracksPayload);
  }

  async getAllPayloads(): Promise<any[]> {
    const payloads = await this.ownTracksPayloadRepository.find({
      order: { receivedAt: 'DESC' },
    });

    return payloads.map((p) => ({
      id: p.id,
      payload: JSON.parse(p.payload) as Record<string, any>,
      source: p.source,
      userAgent: p.userAgent,
      receivedAt: p.receivedAt,
    }));
  }
}
