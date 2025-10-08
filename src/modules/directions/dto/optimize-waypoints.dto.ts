import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OptimizeWaypointsDto {
  @ApiProperty({
    description: 'Origin',
    example: 'Cali, Valle del Cauca',
  })
  @IsString()
  origin: string;

  @ApiProperty({
    description: 'Destination',
    example: 'Cali, Valle del Cauca',
  })
  @IsString()
  destination: string;

  @ApiProperty({
    description: 'Waypoints to optimize',
    example: [
      'Cr 26 D BIS #122-51, Cali',
      'Cl. 13c #75-95, Cali',
      'Cra. 43a Bis #52-81 a 52-1, Cali',
      'Cl. 42 # 39B-81, Cali',
    ],
  })
  @IsString({ each: true })
  waypoints: string[];
}
