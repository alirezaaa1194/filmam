import { Resolver, Query, Args } from '@nestjs/graphql';
import { MovieService } from './movie.service';
import { Movie, MovieFilterInput } from './entity/movie.entity';

@Resolver(() => Movie)
export class MovieResolver {
  constructor(private readonly movieService: MovieService) {}

  @Query(() => [Movie], { name: 'getAllMovies' })
  async getAllMovies(
    @Args('filter', { type: () => MovieFilterInput })
    filter: MovieFilterInput,
  ) {
    return await this.movieService.getAllMovies(filter);
  }
}
