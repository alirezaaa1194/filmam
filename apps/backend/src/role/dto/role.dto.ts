import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { RoleType } from '../../generated/prisma';
import { CreateRoleTranslationDto } from '../../role-translation/dto/role-translation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { appLanguages } from '../../lib/utils';

export class CreateRoleDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    example: RoleType.CREATOR,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  type: string;

  @ApiProperty({
    type: [CreateRoleTranslationDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleTranslationDto)
  @ArrayMinSize(appLanguages.length)
  translations: CreateRoleTranslationDto[];
}

export class GetAllRolesDto extends CommonQueryParamsDto {}

export class DeleteRoleDto {
  @ApiProperty({
    example: [1, 2, 3],
    required: true,
  })
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  role_ids: number[];
}