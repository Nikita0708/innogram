import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateChatDto {
  @ApiProperty({ example: 'Team Future chat', description: 'Name of the chat', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name must not be empty' })
  @MaxLength(100, { message: 'Name must be 100 or less characters' })
  name?: string;

  @ApiProperty({ example: 'This is the best chat in the world', description: 'Chat Description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}