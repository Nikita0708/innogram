import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hi there, this is my message!', description: 'Message' })
  @IsNotEmpty({ message: 'Content must not be empty' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;

  @ApiProperty({ example: ['asset-id-1', 'asset-id-2'], description: 'List of asset IDs to attach to the message', required: false })
  @IsOptional()
  @IsArray({ message: 'asset_ids must be an array' })
  @IsString({ each: true, message: 'Each asset_id must be a string' })
  asset_ids?: string[];

  @ApiProperty({ example: 'message-id-1', description: 'id of a message replied to' })
  @IsOptional()
  @IsString({ message: 'Reply to message Id must be a string' })
  @MaxLength(36, { message: 'Reply to message Id must be 36 or less characters' })
  reply_to_message_id?: string;
}