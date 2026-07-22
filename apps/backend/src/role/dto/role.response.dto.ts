import { ApiProperty } from '@nestjs/swagger';
import { RoleType, AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class RoleTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class RoleResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: RoleType })
  type!: RoleType;

  @ApiProperty({ type: [RoleTranslationDto] })
  translations!: RoleTranslationDto[];
}

export class RoleListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ enum: RoleType })
  type!: RoleType;

  @ApiProperty()
  name!: string;
}

export class PaginatedRolesDto extends PaginationMetaDto {
  @ApiProperty({ type: [RoleListDto] })
  data!: RoleListDto[];
}
