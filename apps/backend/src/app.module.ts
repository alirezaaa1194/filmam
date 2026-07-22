import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { SeasonModule } from './season/season.module';
import { EpisodeModule } from './episode/episode.module';
import { CommentModule } from './comment/comment.module';
import { FactorModule } from './factor/factor.module';
import { RoleModule } from './role/role.module';
import { GenreModule } from './genre/genre.module';
import { UploadModule } from './upload/upload.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { OtpModule } from './otp/otp.module';
import { LoginRequestModule } from './login-request/login-request.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CountryModule } from './country/country.module';
import { LanguageModule } from './language/language.module';
import { TagModule } from './tag/tag.module';
import { SectionModule } from './section/section.module';
import { HeaderMenuModule } from './header-menu/header-menu.module';
import { StatsModule } from './admin-dashboard/stats.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   introspection: true,
    //   playground: false,
    // }),
    MovieModule,
    UserModule,
    SeasonModule,
    EpisodeModule,
    CommentModule,
    FactorModule,
    RoleModule,
    GenreModule,
    UploadModule,
    ContactModule,
    AuthModule,
    RefreshTokenModule,
    OtpModule,
    LoginRequestModule,
    CountryModule,
    LanguageModule,
    TagModule,
    SectionModule,
    HeaderMenuModule,
    StatsModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
