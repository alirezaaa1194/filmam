import { Injectable } from '@nestjs/common';
import { MovieFileRepository } from './repository/movie-file.repository';
import { CreateMovieFilesDto } from './dto/movie-file.dto';
import { TransactionType } from '../common/types/types';

@Injectable()
export class MovieFileService {
  constructor(private movieFileRepository: MovieFileRepository) {}
  async createMovieFiles(
    body: CreateMovieFilesDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    const movieFiles = body.map((movieFile) => ({
      upload_id: movieFile.upload_id,
      type: movieFile.upload_type,
      movie_id: movieId,
      intro_duration: movieFile.intro_duration,
      intro_start_time: movieFile.intro_start_time,
      outro_duration: movieFile.outro_duration,
    }));
    return await this.movieFileRepository.createMovieFile(movieFiles, tx);
  }

  async updateMovieFiles(
    body: CreateMovieFilesDto[],
    movieId: number,
    tx: TransactionType,
  ) {
    await this.movieFileRepository.deleteMovieFiles(movieId, tx);
    return await this.createMovieFiles(body, movieId, tx);
  }
}
