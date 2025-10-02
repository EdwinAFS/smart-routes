import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class SyncUsersDto {
  @ApiProperty({
    description: 'Array of user names to sync',
    example: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  names: string[];
}
