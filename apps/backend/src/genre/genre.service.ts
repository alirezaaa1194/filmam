import { Body, Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  async getAllGenres() {
    return await prisma.genre.findMany();
  }

  // async createGenre(@Body() genreDto: CreateGenreDto) {
  //   const genre = await prisma.genre.create({ data: { slug: genreDto.slug } });
  //   await prisma.genreTranslation.createMany({ data: { name:genreDto.name[0].value } });
  // }
}
