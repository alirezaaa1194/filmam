import { ApiProperty } from '@nestjs/swagger';
import { MovieFileType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieFilesDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  upload_id: number;

  @ApiProperty({ type: 'string', example: 'POSTER', required: true })
  @IsString()
  @IsNotEmpty()
  upload_type: MovieFileType;
}