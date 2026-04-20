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
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  CreateGenreDto,
  DeleteGenresDto,
  GetAllGenresDto,
} from './dto/genre.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Get('all')
  async getAllGenres(@Query() query: GetAllGenresDto) {
    return await this.genreService.getAllGenres(query);
  }

  @ApiBearerAuth()
  @Get('admin/:genreId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getGenreDetailAdmin(@Param('genreId', ParseIntPipe) genreId: number) {
    return await this.genreService.getGenreDetailAdmin(genreId);
  }

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createGenre(@Body() body: CreateGenreDto) {
    return await this.genreService.createGenre(body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteGenres(@Body() body: DeleteGenresDto) {
    return await this.genreService.deleteGenres(body.genre_ids);
  }

  @ApiBearerAuth()
  @Put('admin/:genreId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Body() body: CreateGenreDto,
  ) {
    return await this.genreService.updateGenre(genreId, body);
  }
}
