/*
  Warnings:

  - The values [OTHER] on the enum `SectionSelectionMode` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `created_year` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `row_count` to the `sections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SectionSize" AS ENUM ('SMALL', 'MIDDLE', 'LARGE');

-- AlterEnum
BEGIN;
CREATE TYPE "SectionSelectionMode_new" AS ENUM ('AUTO_CATEGORY', 'AUTO_GENRE', 'AUTO_TAG', 'USER_MOVIE', 'MANUAL');
ALTER TABLE "sections" ALTER COLUMN "selection_mode" TYPE "SectionSelectionMode_new" USING ("selection_mode"::text::"SectionSelectionMode_new");
ALTER TYPE "SectionSelectionMode" RENAME TO "SectionSelectionMode_old";
ALTER TYPE "SectionSelectionMode_new" RENAME TO "SectionSelectionMode";
DROP TYPE "public"."SectionSelectionMode_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SectionViewMode" ADD VALUE 'ADVERTISEMENT';

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "created_year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "row_count" INTEGER NOT NULL,
ADD COLUMN     "size" "SectionSize" NOT NULL;

-- AddForeignKey
ALTER TABLE "section_categories" ADD CONSTRAINT "section_categories_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_categories" ADD CONSTRAINT "section_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_tags" ADD CONSTRAINT "section_tags_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_tags" ADD CONSTRAINT "section_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_genres" ADD CONSTRAINT "section_genres_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_genres" ADD CONSTRAINT "section_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
