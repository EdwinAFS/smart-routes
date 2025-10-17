import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';
/*
"payload": {
      "_type": "location",
      "BSSID": "a8:29:48:3f:d3:33",
      "SSID": "Hi",
      "_id": "af43acf3",
      "acc": 13,
      "alt": 982,
      "batt": 39,
      "bs": 1,
      "cog": 6,
      "conn": "w",
      "created_at": 1760716552,
      "lat": 3.4220044,
      "lon": -76.4646787,
      "m": 1,
      "source": "fused",
      "tid": "et",
      "topic": "owntracks/user/edwin1",
      "tst": 1760716552,
      "vac": 0,
      "vel": 4
    }
*/

interface OwnTracksPayloadResponse {
  _type: string;
  id: string;
  topic: string;
  lat: number;
  lon: number;
  name: string;
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
      const payloadData = JSON.parse(payload.payload) as Record<string, any>;
      const data = payloadData.payload as OwnTracksPayloadResponse;
      return data;
    });

    return dataFiltered.map((payload: OwnTracksPayload) => {
      const payloadData = JSON.parse(payload.payload) as Record<string, any>;
      const data = payloadData.payload as OwnTracksPayloadResponse;

      console.log('data', data);

      return {
        _type: data._type,
        id: data.topic.split('/')[2],
        lat: data.lat.toString(),
        lng: data.lon.toString(),
        name: this.generateName(),
      };
    });
  }

  private generateName() {
    const nameList = [
      'Time',
      'Past',
      'Future',
      'Dev',
      'Fly',
      'Flying',
      'Soar',
      'Soaring',
      'Power',
      'Falling',
      'Fall',
      'Jump',
      'Cliff',
      'Mountain',
      'Rend',
      'Red',
      'Blue',
    ];

    return nameList[Math.floor(Math.random() * nameList.length)];
  }
}
