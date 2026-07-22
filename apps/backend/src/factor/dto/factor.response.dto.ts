import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, FactorFileType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class FactorTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class FactorFileDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  mime_type!: string;

  @ApiPropertyOptional()
  file_name?: string;

  @ApiProperty({ enum: FactorFileType })
  type!: FactorFileType;
}

export class FactorProfileDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  factor_id!: number;

  @ApiProperty()
  upload_id!: number;

  @ApiProperty({ enum: FactorFileType })
  type!: FactorFileType;

  @ApiProperty()
  path!: string;
}

export class FactorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: [FactorTranslationDto] })
  translations!: FactorTranslationDto[];

  @ApiPropertyOptional({ type: FactorProfileDto })
  profile?: FactorProfileDto;
}

export class FactorDetailDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiPropertyOptional({ type: FactorFileDto })
  profile?: FactorFileDto;

  @ApiProperty({ type: [FactorTranslationDto] })
  translations!: FactorTranslationDto[];
}

export class FactorListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiPropertyOptional({ type: FactorProfileDto })
  profile?: FactorProfileDto;
}

export class PaginatedFactorsDto extends PaginationMetaDto {
  @ApiProperty({ type: [FactorListDto] })
  data!: FactorListDto[];
}
