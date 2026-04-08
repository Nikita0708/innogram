import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-id', description: 'Refresh token ID' })
  @IsString()
  refresh_token_id: string;
}
