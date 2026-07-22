import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CommentStatus,
  CommentEntityType,
  CommentVoteStatus,
} from '../../generated/prisma';
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

export class PaginatedCommentsDto extends PaginationMetaDto {
  @ApiProperty({ type: [CommentResponseDto] })
  data!: CommentResponseDto[];
}

export class CommentVoteResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: CommentVoteStatus })
  vote_status!: CommentVoteStatus;
}
