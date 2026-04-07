import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'Display name', required: false })
  @IsOptional()
  @IsString({ message: 'Display Name name must be a string' })
  @MinLength(3, { message: 'Display Name must be at least 3 charachters long' })
  @MaxLength(100, { message: 'Display Name must be 100 characters or less.' })
  display_name?: string;

  @ApiProperty({ example: 'Bio about the user', description: 'User bio', required: false })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MinLength(1, { message: 'Bio must be at least 1 charaсter long' })
  @MaxLength(1000, { message: 'Bio must be 1000 characters or less.' })
  bio?: string;

  @ApiProperty({ example: true, description: 'Is profile public', required: false })
  @IsOptional()
  @IsBoolean({ message: "is_public must be a boolean" })
  is_public?: boolean;

  @ApiProperty({ example: 'https://innogram.com/user/avatar/img.jpg', description: 'User Avatar image url', required: false })
  @IsOptional()
  @IsString({ message: 'Avatar Url must be a string' })
  @MaxLength(500, { message: 'Avatar Url must be 500 characters or less.' })
  avatar_url?: string;

  @ApiProperty({ example: '1990-01-01', description: 'User birthday date', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Birthday must be a Date' })
  birthday?: string;
}