import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class TagTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  tag_id!: number;

  @ApiProperty()
  label!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class TagResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: [TagTranslationDto] })
  translations!: TagTranslationDto[];
}

export class TagListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  label!: string;
}

export class PaginatedTagsDto extends PaginationMetaDto {
  @ApiProperty({ type: [TagListDto] })
  data!: TagListDto[];
}
