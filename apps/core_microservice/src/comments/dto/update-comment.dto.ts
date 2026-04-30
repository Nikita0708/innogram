import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IUpdateCommentRequest } from '@innogram/types';

export class UpdateCommentDto implements IUpdateCommentRequest {
  @ApiProperty({ example: 'Updated comment text', description: 'New content of the comment' })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;
}
