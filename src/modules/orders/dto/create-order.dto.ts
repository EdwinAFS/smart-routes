import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderPointDto {
  @ApiProperty({
    description: 'Address of the order point',
    examples: [
      {
        address: 'Cl. 13 #80 - 187, Pasoancho, Cali, Valle del Cauca',
      },
      {
        address: 'Cl. 42 #80-01, Comuna 17, Cali, Valle del Cauca',
      },
      {
        address:
          'Quintas de Don Simon - Cra 80, 80 #13A #261 13A 261Carrera, Cali, Valle del Cauca',
      },
      {
        address: 'Cra. 66 #1c-87, La Cascada, Cali, Valle del Cauca',
      },
    ],
  })
  @IsString()
  address: string;

  /* @ApiProperty({
    description: 'Latitude of the order point',
    example: 40.7128,
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Longitude of the order point',
    example: -74.006,
  })
  @IsNumber()
  lng: number; */
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the driver assigned to this order',
    example: 'John-Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  driverName?: string;

  @ApiProperty({
    description: 'Latitude of the start location',
    example: 40.7128,
  })
  @IsNumber()
  startLat: number;

  @ApiProperty({
    description: 'Longitude of the start location',
    example: -74.006,
  })
  @IsNumber()
  startLng: number;

  @ApiProperty({
    description: 'Array of order points',
    type: [CreateOrderPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderPointDto)
  orderPoints: CreateOrderPointDto[];
}
