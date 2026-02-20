import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
