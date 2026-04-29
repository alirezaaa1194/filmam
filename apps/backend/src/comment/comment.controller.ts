import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
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
import { CommentEntityType } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Req() req, @Body() body: CreateCommentDto) {
    return await this.commentService.createComment(req.user.userId, body);
  }

  @ApiBearerAuth()
  @Put('admin/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateComment(
    @Body() body: UpdateCommentDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.updateComment(commentId, body);
  }

  @ApiBearerAuth()
  @Put('admin/status/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateCommentStatus(
    @Body() body: UpdateCommentStatusDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentService.updateCommentStatus(commentId, body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteComments(@Body() body: DeleteCommentsDto) {
    return await this.commentService.deleteComments(body);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllComments(@Query() query: GetAllCommentsDto) {
    return await this.commentService.getAllComments(query);
  }

  @ApiBearerAuth()
  @Get('admin/:commentId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCommentDetailAdmin(@Param('commentId') commentId: number) {
    return await this.commentService.getCommentDetailAdmin(commentId);
  }

  @ApiBearerAuth()
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
  @Post('vote/:commentId')
  @UseGuards(JwtAuthGuard)
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
