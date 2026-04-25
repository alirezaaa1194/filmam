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
import {
  CreateMovieDto,
  DeleteMoviesDto,
  GetAllMoviesPublicDto,
  GetMovieDetailPublicDto,
} from './dto/movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { MovieService } from './movie.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppLanguage } from '../common/enums';
import {
  GetUserMovieActionsDto,
  UpdateUserMoviesDto,
} from '../user-movie/dto/user-movie.dto';
import { MovieFilterInput } from './entity/movie.entity';
import { Public } from '../common/decorators/public.decorator';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createMovieAdmin(@Body() body: CreateMovieDto) {
    return this.movieService.createMovieAdmin(body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteMoviesAdmin(@Body() body: DeleteMoviesDto) {
    return this.movieService.deleteMoviesAdmin(body);
  }

  @ApiBearerAuth()
  @Put('admin/:movieId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateMoviesAdmin(
    @Body() body: CreateMovieDto,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.updateMovieAdmin(body, movieId);
  }

  @ApiBearerAuth()
  @Get('admin/:movieId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getMovieDetailAdmin(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.movieService.getMovieDetailAdmin(movieId);
  }

  //graphql
  @ApiBearerAuth()
  @Get('all')
  @Public()
  @UseGuards(JwtAuthGuard)
  async getAllMovies(@Query() query: GetAllMoviesPublicDto, @Req() req) {
    return await this.movieService.getAllMovies(query as MovieFilterInput, req?.user?.userId);
  }

  @ApiBearerAuth()
  @Get('/:slug')
  async getMovieDetailPublic(
    @Param('slug') slug: string,
    @Query() query: GetMovieDetailPublicDto,
  ) {
    return this.movieService.getMovieDetailPublic(slug, query.lang);
  }

  @ApiBearerAuth()
  @Post('user_movies')
  @UseGuards(JwtAuthGuard)
  async updateUserMovies(@Body() body: UpdateUserMoviesDto, @Req() req) {
    return this.movieService.updateUserMovies(body, req.user.userId);
  }

  @ApiBearerAuth()
  @Delete('user_movies/:actionId')
  @UseGuards(JwtAuthGuard)
  async deleteUserMovieAction(
    @Param('actionId', ParseIntPipe) actionId: number,
  ) {
    return this.movieService.deleteUserMovie(actionId);
  }

  @ApiBearerAuth()
  @Get('user_movie_actions/:entityId')
  @UseGuards(JwtAuthGuard)
  async getUserMovieActions(
    @Req() req,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query() query: GetUserMovieActionsDto,
  ) {
    return await this.movieService.getUserMovieActions(
      req.user.userId,
      query.entity_type,
      entityId,
    );
  }
}
