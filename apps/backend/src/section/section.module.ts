import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { SectionRepository } from './repository/section.repository';
import { SectionTranslationModule } from '../section-translation/section-translation.module';
import { SectionMovieModule } from '../section-movie/section-movie.module';
import { UserModule } from '../user/user.module';
import { UserMovieModule } from '../user-movie/user-movie.module';

@Module({
  imports: [SectionTranslationModule, SectionMovieModule, UserModule, UserMovieModule],
  providers: [SectionService, SectionRepository],
  controllers: [SectionController],
  exports: [SectionService, SectionRepository],
})
export class SectionModule {}
