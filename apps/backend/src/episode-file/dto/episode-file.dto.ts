import { ApiProperty } from '@nestjs/swagger';
import { EpisodeFileType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEpisodeFileDto {
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

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  upload_id: number;

  @ApiProperty({ example: EpisodeFileType.POSTER, required: true })
  @IsEnum(EpisodeFileType)
  @IsNotEmpty()
  type: EpisodeFileType;
}
