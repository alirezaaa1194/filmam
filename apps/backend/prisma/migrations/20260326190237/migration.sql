/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `section_movies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SectionMovieViewMode" AS ENUM ('PUZZLE', 'SLIDER_ITEM');

-- AlterTable
ALTER TABLE "section_movies" ADD COLUMN     "order" INTEGER,
ADD COLUMN     "view_mode" "SectionMovieViewMode";

-- AlterTable
ALTER TABLE "section_translations" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "section_movies_order_key" ON "section_movies"("order");
