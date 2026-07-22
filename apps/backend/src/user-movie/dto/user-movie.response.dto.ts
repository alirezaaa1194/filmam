import { ApiProperty } from '@nestjs/swagger';
import { UserMovieType, CommentEntityType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class UserMovieActionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ enum: UserMovieType })
  type!: UserMovieType;

  @ApiProperty()
  progress_time!: number | null;

  @ApiProperty()
  user_id!: number;

  @ApiProperty()
  movie_id!: number | null;

  @ApiProperty()
  episode_id!: number | null;

  @ApiProperty({ enum: CommentEntityType })
  entity_type!: CommentEntityType;
}

export class PaginatedUserMoviesDto extends PaginationMetaDto {
  @ApiProperty({ type: [UserMovieActionResponseDto] })
  data!: UserMovieActionResponseDto[];
}

export class UserMovieActionsDto {
  @ApiProperty({ type: [String] })
  actions!: string[];
}
