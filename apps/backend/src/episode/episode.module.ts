import { forwardRef, Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';
import { EpisodeRepository } from './repository/episode.repository';
import { EpisodeTranslationModule } from '../episode-translation/episode-translation.module';
import { EpisodeFileModule } from '../episode-file/episode-file.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EpisodeTranslationModule, EpisodeFileModule, forwardRef(() => UserModule)],
  controllers: [EpisodeController],
  providers: [EpisodeService, EpisodeRepository],
  exports: [EpisodeService, EpisodeRepository],
})
export class EpisodeModule {}
