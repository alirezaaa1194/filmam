/*
  Warnings:

  - You are about to drop the `EpisodeFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactorFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeasonFiles` table. If the table is not empty, all the data it contains will be lost.

*/
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

-- DropTable
DROP TABLE "EpisodeFiles";

-- DropTable
DROP TABLE "FactorFiles";

-- DropTable
DROP TABLE "MovieFiles";

-- DropTable
DROP TABLE "SeasonFiles";

-- CreateTable
CREATE TABLE "movie_files" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "MovieFileType" NOT NULL,

    CONSTRAINT "movie_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season_files" (
    "id" SERIAL NOT NULL,
    "season_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "SeasonFileType" NOT NULL,

    CONSTRAINT "season_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_files" (
    "id" SERIAL NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "EpisodeFileType" NOT NULL,

    CONSTRAINT "episode_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factor_files" (
    "id" SERIAL NOT NULL,
    "factor_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "FactorFileType" NOT NULL,

    CONSTRAINT "factor_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movie_files" ADD CONSTRAINT "movie_files_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_files" ADD CONSTRAINT "movie_files_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_files" ADD CONSTRAINT "season_files_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_files" ADD CONSTRAINT "season_files_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_files" ADD CONSTRAINT "episode_files_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_files" ADD CONSTRAINT "episode_files_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_files" ADD CONSTRAINT "factor_files_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_files" ADD CONSTRAINT "factor_files_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
