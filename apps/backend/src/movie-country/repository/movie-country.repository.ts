import { TransactionType } from '../../common/types/types';
import { CreateMovieCountriesBodyType } from '../type/movie-country.type';

export class MovieCountryRepository {
  async createMovieCountries(
    body: CreateMovieCountriesBodyType[],
    tx: TransactionType,
  ) {
    return await tx.movieCountry.createMany({ data: body });
  }

  async deleteMovieCountries(movieId: number, tx: TransactionType) {
    return await tx.movieCountry.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }
}
