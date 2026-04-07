import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'This is my post about my dog, her name is Jane', description: 'Content of the post' })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;

  @ApiProperty({ example: 'This is my post about my dog, her name is Jane', description: 'Content of the post' })
  @IsNotEmpty({ message: 'profile_id is required' })
  @IsString({ message: 'profile_id must be a string' })
  @MaxLength(36, { message: 'profile id must be 36 or less characters' })
  profile_id: string;

  @ApiProperty({ example: ['asset-id-1', 'asset-id-2'], description: 'List of asset IDs to attach to post', required: false })
  @IsOptional()
  @IsArray({ message: 'asset_ids must be an array' })
  @IsString({ each: true, message: 'Each asset_id must be a string' })
  asset_ids?: string[];
}