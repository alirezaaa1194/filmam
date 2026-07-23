import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentStatus, CommentEntityType } from '../../generated/prisma';
import { PaginationMetaDto } from '../../common/dto/response.dto';

export class CommentUserDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  email!: string;
}

export class CommentResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty()
  likes_count!: number;

  @ApiProperty()
  dislikes_count!: number;

  @ApiProperty({ enum: CommentStatus })
  status!: CommentStatus;

  @ApiProperty({ enum: CommentEntityType })
  entity_type!: CommentEntityType;

  @ApiProperty()
  movie_id!: number;

  @ApiPropertyOptional()
  episode_id?: number;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  user_id!: number;

  @ApiProperty({ type: CommentUserDto })
  user!: CommentUserDto;
}

export class AllCommentsResponseDto extends CommentResponseDto {
  @ApiProperty()
  movie_title!: string;

  @ApiPropertyOptional()
  season_title?: string;

  @ApiPropertyOptional()
  episode_title?: string;
}

export class PaginatedCommentsDto extends PaginationMetaDto {
  @ApiProperty({ type: [AllCommentsResponseDto] })
  data!: AllCommentsResponseDto[];
}

export class EntityCommentDto extends CommentResponseDto {
  @ApiProperty()
  did_user_liked!: boolean;

  @ApiProperty()
  did_user_disliked!: boolean;
}

export class PaginatedEntityCommentDto extends PaginationMetaDto {
  @ApiProperty({ type: [EntityCommentDto] })
  data!: EntityCommentDto[];
}
