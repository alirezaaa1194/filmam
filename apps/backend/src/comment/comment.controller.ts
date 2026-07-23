import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CommentVoteDto,
  CreateCommentDto,
  DeleteCommentsDto,
  GetAllCommentsDto,
  UpdateCommentDto,
  UpdateCommentStatusDto,
} from './dto/comment.dto';
import { CommentService } from './comment.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { CommentEntityType } from '../generated/prisma';
import { Public } from '../common/decorators/public.decorator';
import { CountResponseDto, MessageResponseDto } from '../common/dto/response.dto';
import {
  CommentResponseDto,
  PaginatedCommentsDto,
  PaginatedEntityCommentDto,
} from './dto/comment.response.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentResponseDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Req() req, @Body() body: CreateCommentDto) {
    return await this.commentService.createComment(req.user.userId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentResponseDto })
  @Put('admin/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateComment(
    @Body() body: UpdateCommentDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.updateComment(commentId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentResponseDto })
  @Put('admin/status/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateCommentStatus(
    @Body() body: UpdateCommentStatusDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.updateCommentStatus(commentId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteComments(@Body() body: DeleteCommentsDto) {
    return await this.commentService.deleteComments(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedCommentsDto })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllComments(@Query() query: GetAllCommentsDto) {
    return await this.commentService.getAllComments(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentResponseDto })
  @Get('admin/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCommentDetailAdmin(@Param('commentId') commentId: number) {
    return await this.commentService.getCommentDetailAdmin(commentId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedEntityCommentDto })
  @Get('movie/:movieSlug')
  @Public()
  @UseGuards(JwtAuthGuard)
  async getMovieComments(
    @Req() req,
    @Query() query: GetAllCommentsDto,
    @Param('movieSlug') movieSlug: string,
  ) {
    return await this.commentService.getMovieOrEpisodeComments(
      CommentEntityType.MOVIE,
      movieSlug,
      query,
      req?.user?.userId,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedEntityCommentDto })
  @Get('episode/:episodeSlug')
  @Public()
  @UseGuards(JwtAuthGuard)
  async getEpisodeComments(
    @Req() req,
    @Query() query: GetAllCommentsDto,
    @Param('episodeSlug') episodeSlug: string,
  ) {
    return await this.commentService.getMovieOrEpisodeComments(
      CommentEntityType.EPISODE,
      episodeSlug,
      query,
      req?.user?.userId,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('vote/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async commentVote(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
    @Body() body: CommentVoteDto,
  ) {
    return await this.commentService.commentVote(
      commentId,
      req.user.userId,
      body,
    );
  }
}
