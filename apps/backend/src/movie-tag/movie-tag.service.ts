import { Injectable } from '@nestjs/common';
import { MovieTagRepository } from './repository/movie-tag.repository';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieTagService {
  constructor(private movieTagRepository: MovieTagRepository) {}
  async createMovieTags(body: number[], movieId: number, tx: TransactionType) {
    const movieTags = body.map((movieTag) => ({
      tag_id: movieTag,
      movie_id: movieId,
    }));
    return await this.movieTagRepository.createMovieTags(movieTags, tx);
  }

  async updateMovieTags(body: number[], movieId: number, tx: TransactionType) {
    await this.movieTagRepository.deleteMovieTags(movieId, tx);
    return await this.createMovieTags(body, movieId, tx);
  }
}
