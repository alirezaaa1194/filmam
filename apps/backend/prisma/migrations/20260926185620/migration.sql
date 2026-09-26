/*
  Warnings:

  - Made the column `imdb_score` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "has_dub" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "imdb_score" SET NOT NULL;
