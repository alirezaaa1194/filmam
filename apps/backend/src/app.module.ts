import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { SeasonModule } from './season/season.module';
import { EpisodeModule } from './episode/episode.module';
import { FilmModule } from './film/film.module';
import { CommentModule } from './comment/comment.module';
import { FactorModule } from './factor/factor.module';
import { RoleModule } from './role/role.module';
import { GenreModule } from './genre/genre.module';
import { UploadModule } from './upload/upload.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { OtpModule } from './otp/otp.module';
import { LoginRequestService } from './login-request/login-request.service';
import { LoginRequestModule } from './login-request/login-request.module';

@Module({
  imports: [
    UserModule,
    MovieModule,
    SeasonModule,
    EpisodeModule,
    FilmModule,
    CommentModule,
    FactorModule,
    RoleModule,
    GenreModule,
    UploadModule,
    TicketModule,
    AuthModule,
    RefreshTokenModule,
    OtpModule,
    LoginRequestModule,
  ],
  controllers: [],
  providers: [LoginRequestService],
})
export class AppModule {}
