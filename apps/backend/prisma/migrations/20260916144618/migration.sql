-- DropIndex
DROP INDEX "user_movies_user_id_movie_id_type_episode_id_key";

-- AlterTable
ALTER TABLE "user_movies" ALTER COLUMN "episode_id" DROP NOT NULL,
ALTER COLUMN "episode_id" DROP DEFAULT;
