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
import { CreateLanguageTranslationDto } from '../../language-translation/dto/language-translation.dto';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';
import { RequiredTranslations } from '../../common/decorators/required-translations.decorator';

export class CreateLanguageDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({
    type: [CreateLanguageTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLanguageTranslationDto)
  @ArrayMinSize(appLanguages.length)
  @RequiredTranslations()
  translations!: CreateLanguageTranslationDto[];
}
export class DeleteLanguagesDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  language_ids!: number[];
}

export class GetAllLanguagesDto extends CommonQueryParamsDto {}


