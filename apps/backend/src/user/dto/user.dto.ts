import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, UserMovieType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class GetAllUsersDto {
  @ApiPropertyOptional({
    name: 'page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    name: 'page_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page_size?: number;

  @ApiPropertyOptional({
    name: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    name: 'sort',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional({
    name: 'blocked',
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  @IsBoolean()
  @IsOptional()
  blocked?: boolean;
}

export class BlockUserDto {
  @ApiProperty({
    name: 'block_expires_at',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  block_expires_at: Date | null;
}

export class DeleteUsersDto {
  @ApiProperty({
    name: 'users_ids',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  users_ids: number[];
}

export class ChangeUserPasswordAdminDto {
  @ApiProperty({
    example: '12345678',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}

export class UpdateUserInfoDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
}

export class GetAllUserMovieDto {
  @ApiProperty({
    type: 'string',
    example: 'BOOKMARK',
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsEnum(UserMovieType, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  type: UserMovieType[];

  @ApiPropertyOptional({
    name: 'page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    name: 'page_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page_size?: number;

  @ApiPropertyOptional({
    name: 'lang',
    required: false,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;
}
