import { ApiProperty } from '@nestjs/swagger';
import { CommentEntityType, UserMovieType } from '@prisma/client';
import { Type } from 'class-transformer';
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
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  movie_id: number;

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
