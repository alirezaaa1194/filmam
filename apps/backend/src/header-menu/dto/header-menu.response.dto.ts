import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  HeaderMenuType,
  SectionFilterKey,
  AppLanguage,
} from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class HeaderMenuTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;

  @ApiProperty()
  menu_id!: number;
}

export class HeaderMenuFilterDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: SectionFilterKey })
  filter_key!: SectionFilterKey;

  @ApiProperty()
  filter_value!: string;
}

export class HeaderMenuResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: HeaderMenuType })
  menu_type!: HeaderMenuType;

  @ApiPropertyOptional()
  href?: string;

  @ApiProperty()
  order!: number;

  @ApiPropertyOptional()
  parent_id?: number;

  @ApiProperty({ type: [HeaderMenuTranslationDto] })
  translations!: HeaderMenuTranslationDto[];

  @ApiPropertyOptional({ type: [HeaderMenuFilterDto] })
  filters?: HeaderMenuFilterDto[];
}

export class HeaderMenuListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: HeaderMenuType })
  menu_type!: HeaderMenuType;

  @ApiPropertyOptional()
  href?: string;

  @ApiProperty()
  order!: number;

  @ApiPropertyOptional()
  parent_id?: number;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ type: [HeaderMenuFilterDto] })
  filters?: HeaderMenuFilterDto[];
}

export class PaginatedHeaderMenusDto extends PaginationMetaDto {
  @ApiProperty({ type: [HeaderMenuListDto] })
  data!: HeaderMenuListDto[];
}
