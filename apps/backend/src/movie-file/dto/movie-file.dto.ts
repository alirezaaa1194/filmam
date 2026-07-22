import { ApiProperty } from '@nestjs/swagger';
import { MovieFileType } from '../../generated/prisma';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieFilesDto {
  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsOptional()
  intro_start_time?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsOptional()
  intro_duration?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsOptional()
  outro_duration?: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  upload_id!: number;

  @ApiProperty({ type: 'string', example: 'POSTER', required: true })
  @IsString()
  @IsNotEmpty()
  upload_type!: MovieFileType;
}


