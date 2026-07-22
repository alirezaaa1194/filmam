import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class CountryTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  label!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class CountryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  code!: string;

  @ApiProperty({ type: [CountryTranslationDto] })
  translations!: CountryTranslationDto[];
}

export class CountryListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  label!: string;
}

export class PaginatedCountriesDto extends PaginationMetaDto {
  @ApiProperty({ type: [CountryListDto] })
  data!: CountryListDto[];
}
