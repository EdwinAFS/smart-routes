import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SendNotificationVariablesDto {
  @ApiProperty({
    description: 'Title of the notification',
    example: 'Nueva ruta disponible',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Body of the notification',
    example: 'Se ha creado una nueva ruta cerca de tu ubicación',
  })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    description: 'Image URL for the notification',
    example:
      'https://i.pinimg.com/originals/db/2a/4d/db2a4d7fb7efb0ba5d3ea67ab99581a7.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional data to send with the notification',
    example: { routeId: '123', action: 'view' },
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}

export class SendNotificationDto {
  @ApiProperty({
    description:
      'FCM token(s) to send the notification to. Can be a single token or an array of tokens.',
    example: ['eXd1234567890abcdef...', 'fYe9876543210zyxwvu...'],
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  @IsOptional()
  tokens?: string | string[];

  @ApiProperty({
    description: 'Variables to send with the notification',
    example: {
      title: 'Nueva ruta disponible',
      body: 'Se ha creado una nueva ruta cerca de tu ubicación',
      imageUrl:
        'https://i.pinimg.com/originals/db/2a/4d/db2a4d7fb7efb0ba5d3ea67ab99581a7.jpg',
      variables: { routeId: '123', action: 'view' },
    },
  })
  @IsObject()
  data: SendNotificationVariablesDto;
}
