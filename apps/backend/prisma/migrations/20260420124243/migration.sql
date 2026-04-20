/*
  Warnings:

  - The values [CATEGORIES] on the enum `SectionFilterKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionFilterKey_new" AS ENUM ('SEARCH', 'GENRES', 'AGE_LIMITS', 'COUNTRIES', 'TAGS', 'LANGUAGES', 'TYPE', 'RELEASED_YEAR_FROM', 'RELEASED_YEAR_TO');
ALTER TABLE "section_filters" ALTER COLUMN "filter_key" TYPE "SectionFilterKey_new" USING ("filter_key"::text::"SectionFilterKey_new");
ALTER TYPE "SectionFilterKey" RENAME TO "SectionFilterKey_old";
ALTER TYPE "SectionFilterKey_new" RENAME TO "SectionFilterKey";
DROP TYPE "public"."SectionFilterKey_old";
COMMIT;
