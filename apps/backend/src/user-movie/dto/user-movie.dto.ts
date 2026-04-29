import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, CommentEntityType, UserMovieType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserMoviesDto {
  @ApiProperty({
    type: 'string',
    example: 'BOOKMARK',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserMovieType)
  type: UserMovieType;

  @ApiProperty({
    type: 'string',
    example: 'MOVIE',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentEntityType)
  entity_type: CommentEntityType;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  movie_id?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episode_id?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  progress_time?: number;
}

export class GetUserMovieActionsDto {
  @ApiProperty({
    type: 'string',
    example: 'MOVIE',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentEntityType)
  entity_type: CommentEntityType;
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
