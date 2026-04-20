/*
  Warnings:

  - The values [AUTO_CATEGORY,AUTO_GENRE,AUTO_TAG] on the enum `SectionSelectionMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_year` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `row_count` on the `sections` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `sections` table. All the data in the column will be lost.
  - You are about to drop the `section_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `section_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `section_tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `released_year` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SectionFilterKey" AS ENUM ('SEARCH', 'GENRES', 'AGE_LIMITS', 'CATEGORIES', 'COUNTRIES', 'TAGS', 'LANGUAGES', 'TYPE', 'RELEASED_YEAR_FROM', 'RELEASED_YEAR_TO');

-- AlterEnum
BEGIN;
CREATE TYPE "SectionSelectionMode_new" AS ENUM ('AUTO', 'USER_MOVIE', 'MANUAL');
ALTER TABLE "sections" ALTER COLUMN "selection_mode" TYPE "SectionSelectionMode_new" USING ("selection_mode"::text::"SectionSelectionMode_new");
ALTER TYPE "SectionSelectionMode" RENAME TO "SectionSelectionMode_old";
ALTER TYPE "SectionSelectionMode_new" RENAME TO "SectionSelectionMode";
DROP TYPE "public"."SectionSelectionMode_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SectionViewMode" ADD VALUE 'HERO';

-- DropForeignKey
ALTER TABLE "section_categories" DROP CONSTRAINT "section_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "section_categories" DROP CONSTRAINT "section_categories_section_id_fkey";

-- DropForeignKey
ALTER TABLE "section_genres" DROP CONSTRAINT "section_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "section_genres" DROP CONSTRAINT "section_genres_section_id_fkey";

-- DropForeignKey
ALTER TABLE "section_tags" DROP CONSTRAINT "section_tags_section_id_fkey";

-- DropForeignKey
ALTER TABLE "section_tags" DROP CONSTRAINT "section_tags_tag_id_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "created_year",
ADD COLUMN     "released_year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "row_count",
DROP COLUMN "size";

-- DropTable
DROP TABLE "section_categories";

-- DropTable
DROP TABLE "section_genres";

-- DropTable
DROP TABLE "section_tags";

-- DropEnum
DROP TYPE "SectionSize";

-- CreateTable
CREATE TABLE "section_filters" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "section_id" INTEGER NOT NULL,
    "filter_key" "SectionFilterKey" NOT NULL,
    "filter_value" TEXT NOT NULL,

    CONSTRAINT "section_filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "section_filters" ADD CONSTRAINT "section_filters_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
