import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'I like this post!', description: 'Content of the comment' })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;

  @ApiProperty({ example: 'parent-comment-id-123', description: 'Id of the parent comment', required: false })
  @IsOptional()
  @IsString({ message: 'Parent Comment Id must be a string' })
  @MaxLength(36)
  parent_comment_id?: string;

  @ApiProperty({ example: ['johndoe', 'janedoe'], description: 'Mentioned usernames', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];
}
