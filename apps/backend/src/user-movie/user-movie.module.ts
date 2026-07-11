import { forwardRef, Module } from '@nestjs/common';
import { UserMovieRepository } from './repository/user-movie.repository';
import { UserMovieService } from './user-movie.service';
import { UserMovieController } from './user-movie.controller';
import { EpisodeModule } from '../episode/episode.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EpisodeModule, forwardRef(() => UserModule)],
  providers: [UserMovieService, UserMovieRepository],
  controllers: [UserMovieController],
  exports: [UserMovieService, UserMovieRepository],
})
export class UserMovieModule {}
