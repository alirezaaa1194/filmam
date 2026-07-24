import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class LanguageTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  label!: string;

  @ApiProperty({ enum: AppLanguage })
  lang!: AppLanguage;
}

export class LanguageResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  code!: string;

  @ApiProperty({ type: [LanguageTranslationDto] })
  translations!: LanguageTranslationDto[];
}

export class LanguageListDto {
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

export class PaginatedLanguagesDto extends PaginationMetaDto {
  @ApiProperty({ type: [LanguageListDto] })
  data!: LanguageListDto[];
}
