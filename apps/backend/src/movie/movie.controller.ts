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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { MovieFilterInput } from './entity/movie.entity';
import { Public } from '../common/decorators/public.decorator';
import { MessageResponseDto } from '../common/dto/response.dto';
import {
  MovieAdminDetailResponseDto,
  MovieDetailPublicResponseDto,
  MovieRecommendedResponseDto,
  PaginatedMoviesDto,
} from './dto/movie.response.dto';

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
  @ApiOkResponse({ type: MessageResponseDto })
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
  async getMovieDetailAdmin(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.movieService.getMovieDetailAdmin(movieId);
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
