import { ApiProperty } from '@nestjs/swagger';
import { CommentEntityType, SectionMovieViewMode } from '../../generated/prisma';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSectionMovieDto {
  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty()
  movie_id!: number;

  @ApiProperty({ example: SectionMovieViewMode.SLIDER_ITEM, required: false })
  @IsOptional()
  @IsEnum(SectionMovieViewMode)
  view_mode?: SectionMovieViewMode;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsNotEmpty()
  order!: number;

  @ApiProperty({
    type: 'string',
    example: 'MOVIE',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentEntityType)
  entity_type!: CommentEntityType;
  
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  episode_id?: number;
}


