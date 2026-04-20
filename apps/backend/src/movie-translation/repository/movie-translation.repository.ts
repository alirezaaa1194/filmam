import { TransactionType } from '../../common/types/types';
import { CreateMovieTranslationBodyType } from '../type/movie-translation.type';

export class MovieTranslationRepository {
  async createMovieTranslation(
    body: CreateMovieTranslationBodyType[],
    tx: TransactionType,
  ) {
    return await tx.movieTranslation.createMany({
      data: body,
    });
  }

  async deleteMovieTranslations(movieId: number, tx: TransactionType) {
    return await tx.movieTranslation.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }
}
