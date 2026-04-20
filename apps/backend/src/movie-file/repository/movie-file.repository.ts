import { TransactionType } from '../../common/types/types';
import { CreateMovieFileBodyType } from '../type/movie-file.type';

export class MovieFileRepository {
  async createMovieFile(body: CreateMovieFileBodyType[], tx: TransactionType) {
    return await tx.movieFile.createMany({ data: body });
  }

  async deleteMovieFiles(movieId: number, tx: TransactionType) {
    return await tx.movieFile.deleteMany({ where: { movie_id: movieId } });
  }
}
