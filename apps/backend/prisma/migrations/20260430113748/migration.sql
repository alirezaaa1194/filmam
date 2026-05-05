-- AlterTable
ALTER TABLE "episode_files" ADD COLUMN     "intro_duration" INTEGER,
ADD COLUMN     "intro_start_time" INTEGER,
ADD COLUMN     "outro_duration" INTEGER;

-- AlterTable
ALTER TABLE "movie_files" ADD COLUMN     "intro_duration" INTEGER,
ADD COLUMN     "intro_start_time" INTEGER,
ADD COLUMN     "outro_duration" INTEGER;
