import { ApiProperty } from '@nestjs/swagger';
import { AppLanguage } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class GenreTranslationDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: AppLanguage })
  language!: AppLanguage;
}

export class GenreResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ type: [GenreTranslationDto] })
  translations!: GenreTranslationDto[];
}

export class GenreListDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;
}

export class PaginatedGenresDto extends PaginationMetaDto {
  @ApiProperty({ type: [GenreListDto] })
  data!: GenreListDto[];
}
