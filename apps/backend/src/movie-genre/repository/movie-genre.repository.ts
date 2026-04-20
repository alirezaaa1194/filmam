import { TransactionType } from '../../common/types/types';
import { prisma } from '../../lib/prisma';
import { CreateMovieGenresBodyType } from '../type/movie-genre.type';

export class MovieGenreRepository {
  async createMovieGenres(
    body: CreateMovieGenresBodyType[],
    tx: TransactionType,
  ) {
    return await tx.movieGenre.createMany({ data: body });
  }

  async deleteMovieGenres(movieId: number, tx: TransactionType) {
    return await tx.movieGenre.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }
}
