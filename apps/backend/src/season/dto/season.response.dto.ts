import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeasonFileType, SourceType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class SeasonFileResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  mime_type!: string;

  @ApiPropertyOptional()
  file_name?: string;

  @ApiProperty({ enum: SourceType })
  source_type!: SourceType;

  @ApiPropertyOptional()
  alt_text?: string;

  @ApiProperty({ enum: SeasonFileType })
  type!: SeasonFileType;
}

export class SeasonResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  movie_id!: number;

  @ApiProperty({ type: [SeasonFileResponseDto] })
  files!: SeasonFileResponseDto[];
}

export class PaginatedSeasonsDto extends PaginationMetaDto {
  @ApiProperty({ type: [SeasonResponseDto] })
  data!: SeasonResponseDto[];
}

export class SeasonEpisodeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  short_description?: string;

  @ApiProperty({ type: [SeasonFileResponseDto] })
  files!: SeasonFileResponseDto[];
}
