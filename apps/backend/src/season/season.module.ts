import { Module } from '@nestjs/common';
import { SeasonController } from './season.controller';
import { SeasonService } from './season.service';
import { SeasonTranslationModule } from '../season-translation/season-translation.module';
import { SeasonFileModule } from '../season-file/season-file.module';
import { SeasonRepository } from './repository/season.repository';
import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';
import { UserMovieModule } from '../user-movie/user-movie.module';
import { NotificationModule } from '../notification/notification.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    UserModule,
    SeasonTranslationModule,
    SeasonFileModule,
    MovieModule,
    UserMovieModule,
    NotificationModule,
    UploadModule
  ],
  controllers: [SeasonController],
  providers: [SeasonRepository, SeasonService],
  exports: [SeasonRepository, SeasonService],
})
export class SeasonModule {}
