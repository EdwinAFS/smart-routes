import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { OwnTracksPayload } from './entities/owntracks-payload.entity';
import { LocationGateway } from './location.gateway';

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
    private readonly locationGateway: LocationGateway,
  ) {}

  // Type guard para validar que el payload es de tipo location
  private isLocationPayload(
    payload: unknown,
  ): payload is OwnTracksLocationData {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      '_type' in payload &&
      (payload as Record<string, unknown>)._type === 'location' &&
      'lat' in payload &&
      'lon' in payload &&
      'topic' in payload &&
      typeof (payload as Record<string, unknown>).lat === 'number' &&
      typeof (payload as Record<string, unknown>).lon === 'number' &&
      typeof (payload as Record<string, unknown>).topic === 'string'
    );
  }

  async savePayload(
    payload: any,
    userAgent?: string,
  ): Promise<OwnTracksPayload> {
    const ownTracksPayload = new OwnTracksPayload();

    ownTracksPayload.payload = JSON.stringify(payload, null, 2);
    ownTracksPayload.userAgent = userAgent || '';

    const saved = await this.ownTracksPayloadRepository.save(ownTracksPayload);

    // Emitir la nueva ubicación en tiempo real vía WebSocket
    try {
      // Check if it's a location type payload using type guard
      if (this.isLocationPayload(payload)) {
        const id = payload.topic.split('/')[2] || 'unknown';
        const locationUpdate = {
          _type: payload._type,
          id: payload.topic.split('/')[2] || 'unknown',
          lat: payload.lat.toString(),
          lng: payload.lon.toString(),
          name: id,
          timestamp: saved.receivedAt.toISOString(),
        };
        this.locationGateway.sendLocationUpdate(locationUpdate);
      }
    } catch (error) {
      console.error('Error emitiendo ubicación via WebSocket:', error);
    }

    return saved;
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

      const id = data.topic.split('/')[2] || 'unknown';

      return {
        _type: data._type,
        id: id,
        lat: data.lat.toString(),
        lng: data.lon.toString(),
        name: id,
      };
    });

    return dataMapped;
  }

  async getTrackerStatus(deviceId: string): Promise<{
    isActive: boolean;
    deviceId: string;
    lastUpdate: Date | null;
    secondsSinceLastUpdate: number | null;
  }> {
    // Obtener todos los payloads ordenados por fecha descendente y de los ultimo minuto
    const payloads = await this.ownTracksPayloadRepository.find({
      where: {
        receivedAt: MoreThan(new Date(Date.now() - 60000)),
      },
      order: { receivedAt: 'DESC' },
    });

    // Buscar el último payload que corresponda al deviceId
    let lastPayload: OwnTracksPayload | null = null;

    for (const payload of payloads) {
      try {
        const dataTrack: unknown =
          typeof payload.payload === 'string'
            ? JSON.parse(payload.payload)
            : payload.payload;

        if (this.isLocationPayload(dataTrack)) {
          const id = dataTrack.topic.split('/')[2] || 'unknown';
          if (id === deviceId) {
            lastPayload = payload;
            break;
          }
        }
      } catch (error) {
        console.error('Error parsing payload:', error);
      }
    }

    // Si no se encontró ningún payload para el dispositivo
    if (!lastPayload) {
      return {
        isActive: false,
        deviceId,
        lastUpdate: null,
        secondsSinceLastUpdate: null,
      };
    }

    // Calcular la diferencia de tiempo en segundos
    const now = new Date();
    const lastUpdate = lastPayload.receivedAt;
    const timeDifference = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / 1000,
    );

    // Verificar si fue en los últimos 30 segundos
    const isActive = timeDifference <= 30;

    return {
      isActive,
      deviceId,
      lastUpdate,
      secondsSinceLastUpdate: timeDifference,
    };
  }
}
