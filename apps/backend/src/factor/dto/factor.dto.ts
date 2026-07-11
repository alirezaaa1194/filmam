import { AppLanguage, FactorFileType } from '../../generated/prisma';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFactorTranslationDto } from '../../factor-translation/dto/factor-translation.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';

export class CreateFactorUploadDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  upload_id: number;

  @ApiProperty({
    example: FactorFileType.PROFILE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FactorFileType)
  upload_type: FactorFileType;
}

export class CreateFactorDto {
  @ApiPropertyOptional({
    name: 'slug',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    type: CreateFactorUploadDto,
    required: true,
  })
  @IsOptional()
  @Type(() => CreateFactorUploadDto)
  profile?: CreateFactorUploadDto;

  @ApiProperty({
    type: [CreateFactorTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFactorTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateFactorTranslationDto[];
}

export class DeleteFactorsDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  factor_ids: number[];
}

export class GetFactorDetailPublicQueryDto {
  @ApiPropertyOptional({
    name: 'lang',
    required: false,
  })
  @IsOptional()
  @IsString()
  lang?: AppLanguage;
}

export class GetAllFactorsDto extends CommonQueryParamsDto {}
