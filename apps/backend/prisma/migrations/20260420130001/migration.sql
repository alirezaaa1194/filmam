/*
  Warnings:

  - You are about to drop the `hero_movies` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[movie_id,order]` on the table `movie_factors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[section_id,movie_id,order]` on the table `section_movies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "hero_movies" DROP CONSTRAINT "hero_movies_movie_id_fkey";

-- DropIndex
DROP INDEX "movie_factors_order_key";

-- DropTable
DROP TABLE "hero_movies";

-- CreateIndex
CREATE UNIQUE INDEX "movie_factors_movie_id_order_key" ON "movie_factors"("movie_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "section_movies_section_id_movie_id_order_key" ON "section_movies"("section_id", "movie_id", "order");
