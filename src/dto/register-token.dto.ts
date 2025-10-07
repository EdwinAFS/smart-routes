import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTokenDto {
  @ApiProperty({
    description: 'FCM token to register',
    example: 'eXd1234567890abcdef_your_fcm_token_here',
  })
  @IsString()
  token: string;
}
