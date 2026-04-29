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

import { ApiBearerAuth } from '@nestjs/swagger';
import { GetAllUserMovieDto, GetUserMovieActionsDto, UpdateUserMoviesDto } from './dto/user-movie.dto';
import { UserMovieService } from './user-movie.service';

@Controller('user-movie')
export class UserMovieController {
  constructor(private userMovieService: UserMovieService) {}

  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUserMovies(@Req() req, @Query() query: GetAllUserMovieDto) {
    return await this.userMovieService.getAllUserMovies(req.user.userId, query);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async updateUserMovies(@Body() body: UpdateUserMoviesDto, @Req() req) {
    return this.userMovieService.updateUserMovies2(body, req.user.userId);
  }

  @ApiBearerAuth()
  @Delete('/:actionId')
  @UseGuards(JwtAuthGuard)
  async deleteUserMovieAction(
    @Param('actionId', ParseIntPipe) actionId: number,
  ) {
    return this.userMovieService.deleteUserMovie(actionId);
  }

  @ApiBearerAuth()
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
