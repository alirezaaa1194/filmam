import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCountryTranslationDto } from '../../country-translation/dto/country-translation.dto';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';
import { RequiredTranslations } from '../../common/decorators/required-translations.decorator';

export class CreateCountryDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({
    type: [CreateCountryTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCountryTranslationDto)
  @ArrayMinSize(appLanguages.length)
  @RequiredTranslations()
  translations!: CreateCountryTranslationDto[];
}

export class DeleteCountriesDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  country_ids!: number[];
}

export class GetAllCountriesDto extends CommonQueryParamsDto {}

