import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class GetCommentsQueryDto {
  @ApiProperty({ example: 1, description: 'Number of the pagination page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, description: 'Limit of the items on the page', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1)
  limit?: number;
}