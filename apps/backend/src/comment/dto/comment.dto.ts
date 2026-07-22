import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CommentEntityType,
  CommentStatus,
  CommentVoteStatus,
} from '../../generated/prisma';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommonQueryParamsDto } from '../../common/dto/query-param.dto';
import { Transform, Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  episode_id?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  movie_id?: number;

  @ApiProperty({
    enum: CommentEntityType,
    example: CommentEntityType.MOVIE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentEntityType)
  entity_type!: CommentEntityType;

  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  body!: string;
}

export class UpdateCommentDto {
  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
  @IsString()
  body!: string;
}

export class UpdateCommentStatusDto {
  @ApiProperty({
    enum: CommentStatus,
    example: CommentStatus.APPROVED,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentStatus)
  status!: CommentStatus;
}

export class DeleteCommentsDto {
  @ApiProperty({ type: 'number', isArray: true, required: true })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsArray()
  comment_ids!: number[];
}

export class GetAllCommentsDto extends CommonQueryParamsDto {
  @ApiProperty({
    example: CommentStatus.APPROVED,
    required: false,
    isArray: false,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? [value] : !value ? [] : value,
  )
  status?: CommentStatus[];
}

export class CommentVoteDto {
  @ApiProperty({
    enum: CommentVoteStatus,
    example: CommentVoteStatus.LIKE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CommentVoteStatus)
  vote_status!: CommentVoteStatus;
}

export class GetEntityCommentsDto {
  @ApiPropertyOptional({
    name: 'page',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    name: 'page_size',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page_size?: number;
}


