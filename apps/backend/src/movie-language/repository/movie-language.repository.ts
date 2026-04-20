import { TransactionType } from '../../common/types/types';
import { CreateMovieLanguagesBodyType } from '../type/movie-language.type';

export class MovieLanguageRepository {
  async createMovieLanguages(
    body: CreateMovieLanguagesBodyType[],
    tx: TransactionType,
  ) {
    return await tx.movieLanguage.createMany({ data: body });
  }

  async deleteMovieLanguages(movieId: number, tx: TransactionType) {
    return await tx.movieLanguage.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }
}
