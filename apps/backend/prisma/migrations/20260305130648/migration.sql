-- DropForeignKey
ALTER TABLE "EpisodeFiles" DROP CONSTRAINT "EpisodeFiles_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeFiles" DROP CONSTRAINT "EpisodeFiles_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "FactorFiles" DROP CONSTRAINT "FactorFiles_factor_id_fkey";

-- DropForeignKey
ALTER TABLE "FactorFiles" DROP CONSTRAINT "FactorFiles_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieFiles" DROP CONSTRAINT "MovieFiles_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieFiles" DROP CONSTRAINT "MovieFiles_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "SeasonFiles" DROP CONSTRAINT "SeasonFiles_season_id_fkey";

-- DropForeignKey
ALTER TABLE "SeasonFiles" DROP CONSTRAINT "SeasonFiles_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "episode_translations" DROP CONSTRAINT "episode_translations_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_season_id_fkey";

-- DropForeignKey
ALTER TABLE "factor_translations" DROP CONSTRAINT "factor_translations_factor_id_fkey";

-- DropForeignKey
ALTER TABLE "genre_translations" DROP CONSTRAINT "genre_translations_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "login_requests" DROP CONSTRAINT "login_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_factors" DROP CONSTRAINT "movie_factors_factor_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_factors" DROP CONSTRAINT "movie_factors_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_factors" DROP CONSTRAINT "movie_factors_role_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_genres" DROP CONSTRAINT "movie_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_genres" DROP CONSTRAINT "movie_genres_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_translations" DROP CONSTRAINT "movie_translations_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "otps" DROP CONSTRAINT "otps_user_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "role_translations" DROP CONSTRAINT "role_translations_role_id_fkey";

-- DropForeignKey
ALTER TABLE "season_translation" DROP CONSTRAINT "season_translation_season_id_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_movies" DROP CONSTRAINT "user_movies_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "user_movies" DROP CONSTRAINT "user_movies_user_id_fkey";

-- AddForeignKey
ALTER TABLE "MovieFiles" ADD CONSTRAINT "MovieFiles_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieFiles" ADD CONSTRAINT "MovieFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_translations" ADD CONSTRAINT "movie_translations_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonFiles" ADD CONSTRAINT "SeasonFiles_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonFiles" ADD CONSTRAINT "SeasonFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_translation" ADD CONSTRAINT "season_translation_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeFiles" ADD CONSTRAINT "EpisodeFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeFiles" ADD CONSTRAINT "EpisodeFiles_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_translations" ADD CONSTRAINT "episode_translations_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactorFiles" ADD CONSTRAINT "FactorFiles_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactorFiles" ADD CONSTRAINT "FactorFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_translations" ADD CONSTRAINT "factor_translations_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_factors" ADD CONSTRAINT "movie_factors_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_factors" ADD CONSTRAINT "movie_factors_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_factors" ADD CONSTRAINT "movie_factors_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_translations" ADD CONSTRAINT "role_translations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genre_translations" ADD CONSTRAINT "genre_translations_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_requests" ADD CONSTRAINT "login_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
