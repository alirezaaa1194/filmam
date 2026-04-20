import { Injectable, NotFoundException } from '@nestjs/common';
import { GenreRepository } from './repository/genre.repository';
import { CreateGenreDto, GetAllGenresDto } from './dto/genre.dto';
import { GenreTranslationService } from '../genre-translation/genre-translation.service';
import { defaultLang, paginationCalculator } from '../lib/utils';
import { SortType } from '../common/enums';
import { prisma } from '../lib/prisma';

@Injectable()
export class GenreService {
  constructor(
    private genreRepository: GenreRepository,
    private genreTranslationService: GenreTranslationService,
  ) {}

  async getAllGenres(query: GetAllGenresDto) {
    const { page, page_size } = paginationCalculator(
      query.page || 1,
      query.page_size || 10,
    );
    const genres = await this.genreRepository.getAllGenres({
      page,
      page_size,
      search: query.search?.trim() ?? '',
      sort_type: query.sort === SortType.ASC ? 'asc' : 'desc',
      lang: query.lang || defaultLang,
    });
    const normalizedGenres = genres.map((genre) => {
      const { translations, ...otherGenreInfo } = genre;
      const genreTranslation = translations[0];
      return { ...otherGenreInfo, name: genreTranslation.name };
    });
    const genresCount = await this.genreRepository.getGenresCount(
      query.search?.trim(),
    );
    return {
      page: page + 1,
      page_size: page_size,
      count: genresCount,
      data: normalizedGenres,
    };
  }

  async getGenreDetailAdmin(genreId: number) {
    const genre = await this.genreRepository.getGenreDetailAdmin(genreId);
    if (genre) {
      return genre;
    } else {
      throw new NotFoundException('Genre not found');
    }
  }

  async createGenre(body: CreateGenreDto) {
    const result = await prisma.$transaction(async (tx) => {
      const createdGenre = await this.genreRepository.createGenre(
        body.slug,
        tx,
      );
      return await this.genreTranslationService.createGenreTranslation(
        body.translations,
        createdGenre.id,
        tx,
      );
    });
    return result;
  }

  async deleteGenres(genreIds: number[]) {
    return await this.genreRepository.deleteGenres(genreIds);
  }

  async updateGenre(genreId: number, body: CreateGenreDto) {
    const result = await prisma.$transaction(async (tx) => {
      await this.genreRepository.updateGenre(genreId, body);
      return await this.genreTranslationService.updateGenreTranslation(
        genreId,
        body.translations,
        tx,
      );
    });
    return result;
  }
}
