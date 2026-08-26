import { AppLanguage, HeaderMenuType } from '../../generated/prisma';
import { CreateHeaderMenuTranslationDto } from '../../header-menu-translation/dto/header-menu-translation.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { appLanguages, defaultLang } from '../../lib/utils';
import { HeaderMenuFilter } from '../../header-menu-filter/dto/header-menu-filter.dto';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { RequiredTranslations } from '../../common/decorators/required-translations.decorator';
import { MenuType } from '../../common/enums';

export class CreateHeaderMenuDto {
  @ApiProperty({
    example: HeaderMenuType.PAGE,
    required: true,
  })
  @IsEnum(HeaderMenuType)
  @IsNotEmpty()
  menu_type!: HeaderMenuType;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  href?: string;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  order!: number;

  @ApiProperty({ type: 'number', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({
    type: [CreateHeaderMenuTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(appLanguages.length)
  @RequiredTranslations()
  translations!: CreateHeaderMenuTranslationDto[];

  @ApiProperty({
    required: false,
    type: [HeaderMenuFilter],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  filters?: HeaderMenuFilter[];
}

export class DeleteHeaderMenuDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  menu_ids!: number[];
}

export class GetAllHeaderMenusAdminDto extends CommonQueryParamsDto {
  @ApiPropertyOptional({
    name: 'type',
    required: false,
    enum: MenuType,
  })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;
}

export class GetAllHeaderMenusPublicDto {
  @ApiPropertyOptional({
    name: 'lang',
    required: false,
    default: defaultLang,
    enum: AppLanguage,
  })
  @IsEnum(AppLanguage)
  @IsOptional()
  lang?: AppLanguage;
}
