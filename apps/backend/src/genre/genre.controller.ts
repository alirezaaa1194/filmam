import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Admin } from '../common/decorators/role.decorator';
import { GenreService } from './genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // @Get('all')
  // @Admin()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // getAllGenres() {
  //   return this.genreService.getAllGenres();
  // }

  // @Post()
  // @Admin()
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // createGenre() {
  //   return this.genreService.getAllGenres();
  // }
}
