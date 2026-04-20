import { ApiProperty } from '@nestjs/swagger';
import { SectionMovieViewMode } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSectionMovieDto {
  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty()
  movie_id: number;
  
  @ApiProperty({ example: SectionMovieViewMode.SLIDER_ITEM, required: false })
  @IsOptional()
  @IsEnum(SectionMovieViewMode)
  view_mode?: SectionMovieViewMode;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}
