import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';

interface OwnTracksLocationData {
  _type: string;
  topic: string;
  lat: number;
  lon: number;
  [key: string]: any;
}

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

    const dataFiltered = payloads.filter((payload: OwnTracksPayload) => {
      try {
        // Handle both string and object payloads
        const dataTrack: unknown =
          typeof payload.payload === 'string'
            ? JSON.parse(payload.payload)
            : payload.payload;

        // Type guard to check if data is OwnTracksLocationData
        const isLocationData = (obj: unknown): obj is OwnTracksLocationData => {
          return (
            typeof obj === 'object' &&
            obj !== null &&
            '_type' in obj &&
            (obj as Record<string, unknown>)._type === 'location' &&
            'lat' in obj &&
            'lon' in obj &&
            typeof (obj as Record<string, unknown>).lat === 'number' &&
            typeof (obj as Record<string, unknown>).lon === 'number'
          );
        };

        // Only include location type payloads that have coordinates
        return isLocationData(dataTrack);
      } catch (error) {
        console.error('Error parsing payload:', error);
        return false;
      }
    });

    const dataMapped = dataFiltered.map((payload: OwnTracksPayload) => {
      // Handle both string and object payloads
      const data: OwnTracksLocationData = (
        typeof payload.payload === 'string'
          ? JSON.parse(payload.payload)
          : payload.payload
      ) as OwnTracksLocationData;

      return {
        _type: data._type,
        id: data.topic.split('/')[2] || 'unknown',
        lat: data.lat.toString(),
        lng: data.lon.toString(),
        name: this.generateName(),
      };
    });

    return dataMapped;
  }

  private generateName() {
    const nameList = ['Edwin', 'Moonie'];

    return nameList[Math.floor(Math.random() * nameList.length)];
  }
}
