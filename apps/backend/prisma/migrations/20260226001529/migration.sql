/*
  Warnings:

  - You are about to drop the column `entity_id` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `src` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the `films` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `file_name` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadFileType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "MovieFileType" AS ENUM ('POSTER', 'BANNER', 'THUMBNAIL', 'TRAILER', 'FILM');

-- CreateEnum
CREATE TYPE "SeasonFileType" AS ENUM ('BANNER', 'TRAILER');

-- CreateEnum
CREATE TYPE "EpisodeFileType" AS ENUM ('BANNER', 'TRAILER');

-- CreateEnum
CREATE TYPE "FactorFileType" AS ENUM ('PROFILE');

-- DropForeignKey
ALTER TABLE "films" DROP CONSTRAINT "films_movie_id_fkey";

-- AlterTable
ALTER TABLE "uploads" DROP COLUMN "entity_id",
DROP COLUMN "entity_type",
DROP COLUMN "media_type",
DROP COLUMN "src",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "mime_type" "UploadFileType" NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "width" INTEGER,
ALTER COLUMN "alt_text" DROP NOT NULL;

-- DropTable
DROP TABLE "films";

-- DropEnum
DROP TYPE "UserMovieEntityType";

-- DropEnum
DROP TYPE "UserMovieMediaType";

-- CreateTable
CREATE TABLE "MovieFiles" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "MovieFileType" NOT NULL,

    CONSTRAINT "MovieFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonFiles" (
    "id" SERIAL NOT NULL,
    "season_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "SeasonFileType" NOT NULL,

    CONSTRAINT "SeasonFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeFiles" (
    "id" SERIAL NOT NULL,
    "episode_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "EpisodeFileType" NOT NULL,

    CONSTRAINT "EpisodeFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactorFiles" (
    "id" SERIAL NOT NULL,
    "factor_id" INTEGER NOT NULL,
    "upload_id" INTEGER NOT NULL,
    "type" "FactorFileType" NOT NULL,

    CONSTRAINT "FactorFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieFiles" ADD CONSTRAINT "MovieFiles_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieFiles" ADD CONSTRAINT "MovieFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonFiles" ADD CONSTRAINT "SeasonFiles_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonFiles" ADD CONSTRAINT "SeasonFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeFiles" ADD CONSTRAINT "EpisodeFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeFiles" ADD CONSTRAINT "EpisodeFiles_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactorFiles" ADD CONSTRAINT "FactorFiles_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "factors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactorFiles" ADD CONSTRAINT "FactorFiles_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
