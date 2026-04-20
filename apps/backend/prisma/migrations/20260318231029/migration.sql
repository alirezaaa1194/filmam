/*
  Warnings:

  - You are about to drop the column `country` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `movie_language` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "country",
DROP COLUMN "movie_language";
