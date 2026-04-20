import { TransactionType } from '../../common/types/types';
import { CreateMovieTagsBodyType } from '../type/movie-tag.type';

export class MovieTagRepository {
  async createMovieTags(body: CreateMovieTagsBodyType[], tx: TransactionType) {
    return await tx.movieTag.createMany({ data: body });
  }

  async deleteMovieTags(movieId: number, tx: TransactionType) {
    return await tx.movieTag.deleteMany({
      where: {
        movie_id: movieId,
      },
    });
  }
}
