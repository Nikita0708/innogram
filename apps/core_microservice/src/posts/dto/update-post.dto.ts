import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'This is my post about my dog, her name is Jane', description: 'Content of the post', required: false })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiProperty({ example: ['asset-id-1', 'asset-id-2'], description: 'List of asset IDs to attach to post', required: false })
  @IsOptional()
  @IsArray({ message: 'asset_ids must be an array' })
  @IsString({ each: true, message: 'Each asset_id must be a string' })
  asset_ids?: string[];
}