import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;
}
