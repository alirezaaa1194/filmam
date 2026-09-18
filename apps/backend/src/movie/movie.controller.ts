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
  GetMovieSeasonsAndEpisodesDto,
} from './dto/movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { MovieService } from './movie.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CountResponseDto } from '../common/dto/response.dto';
import {
  MovieAdminDetailResponseDto,
  MovieDetailPublicResponseDto,
  MovieRecommendedResponseDto,
  MovieSeasonsAndEpisodesResponseDto,
  PaginatedMoviesDto,
} from './dto/movie.response.dto';
import { MovieFilterInput } from './type/movie.type';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MovieAdminDetailResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createMovieAdmin(@Body() body: CreateMovieDto) {
    return this.movieService.createMovieAdmin(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteMoviesAdmin(@Body() body: DeleteMoviesDto) {
    return this.movieService.deleteMoviesAdmin(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MovieAdminDetailResponseDto })
  @Put('admin/:movieId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateMoviesAdmin(
    @Body() body: CreateMovieDto,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.updateMovieAdmin(body, movieId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MovieAdminDetailResponseDto })
  @Get('admin/:movieId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getMovieDetailAdmin(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query() query: GetMovieDetailPublicDto,
  ) {
    return this.movieService.getMovieDetailAdmin(
      movieId,
      undefined,
      query.lang,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedMoviesDto })
  @Get('all')
  @Public()
  @UseGuards(JwtAuthGuard)
  async getAllMovies(@Query() query: GetAllMoviesPublicDto, @Req() req) {
    return await this.movieService.getAllMovies(
      query as MovieFilterInput,
      req?.user?.userId,
    );
  }

  @ApiOkResponse({ type: [MovieRecommendedResponseDto] })
  @Get('recommended/:slug')
  async getRecommendedMovies(
    @Param('slug') slug: string,
    @Query() query: GetMovieDetailPublicDto,
  ) {
    return this.movieService.getRecommendedMovies(slug, query.lang);
  }

  @ApiOkResponse({ type: MovieSeasonsAndEpisodesResponseDto })
  @Get(':slug/episodes')
  async getMovieSeasonsAndEpisodes(
    @Param('slug') slug: string,
    @Query() query: GetMovieSeasonsAndEpisodesDto,
  ) {
    return await this.movieService.getMovieSeasonsAndEpisodes(slug, query.lang);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MovieDetailPublicResponseDto })
  @Get('/:slug')
  async getMovieDetailPublic(
    @Param('slug') slug: string,
    @Query() query: GetMovieDetailPublicDto,
  ) {
    return this.movieService.getMovieDetailPublic(slug, query.lang);
  }
}
