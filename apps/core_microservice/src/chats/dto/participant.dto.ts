import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ParticipantDto {
  @ApiProperty({ example: 'profile-id-1', description: 'Profile Id of the participant' })
  @IsNotEmpty({ message: 'Profile Id is required' })
  @IsString({ message: 'Profile Id must be a string' })
  @MaxLength(36, { message: 'Name must be 36 or less characters' })
  profile_id: string;
}