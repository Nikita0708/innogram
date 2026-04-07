import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'Team Future chat', description: 'Name of the chat' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name must not be empty' })
  @MaxLength(100, { message: 'Name must be 100 or less characters' })
  name: string;

  @ApiProperty({ example: 'private', description: 'Type of the chat', enum: ['private', 'group'] })
  @IsNotEmpty({ message: 'Type is required' })
  @IsIn(['private', 'group'], { message: 'Type must be either private or group' })
  type: 'private' | 'group';

  @ApiProperty({ example: ['user-id-1', 'user-id-2'], description: 'List of the participant ids' })
  @IsNotEmpty({ message: 'You must add at least 1 user to the group' })
  @IsArray({ message: 'user_ids must be an array' })
  @IsString({ each: true, message: 'Each user_id must be a string' })
  participant_ids: string[];

  @ApiProperty({ example: 'This is the best chat in the world', description: 'Chat Description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}