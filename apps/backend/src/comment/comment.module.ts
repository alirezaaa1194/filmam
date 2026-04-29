import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './repository/comment.repository';
import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';
import { EpisodeModule } from '../episode/episode.module';

@Module({
  imports: [UserModule, MovieModule, EpisodeModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
