import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TakeOrderDto {
  @ApiProperty({
    description: 'Latitude of the driver location',
    example: 3.413325,
  })
  @IsNumber()
  startLat: number;

  @ApiProperty({
    description: 'Longitude of the driver location',
    example: -76.529784,
  })
  @IsNumber()
  startLng: number;
}
