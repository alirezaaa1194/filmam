import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  GetAllUserMovieDto,
  GetUserMovieActionsDto,
  UpdateUserMoviesDto,
} from './dto/user-movie.dto';
import { UserMovieService } from './user-movie.service';
import {
  PaginatedUserMoviesDto,
  UserMovieActionResponseDto,
} from './dto/user-movie.response.dto';

@Controller('user-movie')
export class UserMovieController {
  constructor(private userMovieService: UserMovieService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedUserMoviesDto })
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUserMovies(@Req() req, @Query() query: GetAllUserMovieDto) {
    return await this.userMovieService.getAllUserMovies(req.user.userId, query);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserMovieActionResponseDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async updateUserMovies(@Body() body: UpdateUserMoviesDto, @Req() req) {
    return this.userMovieService.voteUserMovies(body, req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserMovieActionResponseDto })
  @Delete('/:actionId')
  @UseGuards(JwtAuthGuard)
  async deleteUserMovieAction(
    @Param('actionId', ParseIntPipe) actionId: number,
  ) {
    return this.userMovieService.deleteUserMovie(actionId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: [UserMovieActionResponseDto] })
  @Get('movie_actions/:entityId')
  @UseGuards(JwtAuthGuard)
  async getUserMovieActions(
    @Req() req,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query() query: GetUserMovieActionsDto,
  ) {
    return await this.userMovieService.getUserMovieActions(
      req.user.userId,
      query.entity_type,
      entityId,
    );
  }
}
