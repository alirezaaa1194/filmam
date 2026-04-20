import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreRepository } from './repository/genre.repository';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { GenreTranslationModule } from '../genre-translation/genre-translation.module';

@Module({
  imports: [UserModule, GenreTranslationModule],
  providers: [GenreService, GenreRepository, JwtStrategy],
  controllers: [GenreController],
  exports: [GenreService, GenreRepository],
})
export class GenreModule {}
