import { ApiProperty } from '@nestjs/swagger';
import { EpisodeFileType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEpisodeFileDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  upload_id: number;

  @ApiProperty({ example: EpisodeFileType.POSTER, required: true })
  @IsEnum(EpisodeFileType)
  @IsNotEmpty()
  type: EpisodeFileType;
}
