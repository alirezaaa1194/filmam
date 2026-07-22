import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { defaultLang } from '../../lib/utils';
import { SortType } from '../enums';

export class CommonQueryParamsDto {
  @ApiPropertyOptional({
    name: 'page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    name: 'page_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page_size?: number;

  @ApiPropertyOptional({
    name: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    name: 'lang',
    required: false,
    default: defaultLang,
    enum: AppLanguage,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;

  @ApiPropertyOptional({
    name: 'sort',
    required: false,
    default: SortType.ASC,
    enum: SortType,
  })
  @IsEnum(SortType)
  @IsOptional()
  sort?: SortType;
}

