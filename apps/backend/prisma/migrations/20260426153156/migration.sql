/*
  Warnings:

  - The values [BANNER] on the enum `EpisodeFileType` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANNER] on the enum `SeasonFileType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `episode_number` on the `episodes` table. All the data in the column will be lost.
  - Added the required column `order` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EpisodeFileType_new" AS ENUM ('POSTER', 'TRAILER');
ALTER TABLE "episode_files" ALTER COLUMN "type" TYPE "EpisodeFileType_new" USING ("type"::text::"EpisodeFileType_new");
ALTER TYPE "EpisodeFileType" RENAME TO "EpisodeFileType_old";
ALTER TYPE "EpisodeFileType_new" RENAME TO "EpisodeFileType";
DROP TYPE "public"."EpisodeFileType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SeasonFileType_new" AS ENUM ('POSTER', 'TRAILER');
ALTER TABLE "season_files" ALTER COLUMN "type" TYPE "SeasonFileType_new" USING ("type"::text::"SeasonFileType_new");
ALTER TYPE "SeasonFileType" RENAME TO "SeasonFileType_old";
ALTER TYPE "SeasonFileType_new" RENAME TO "SeasonFileType";
DROP TYPE "public"."SeasonFileType_old";
COMMIT;

-- AlterTable
ALTER TABLE "episodes" DROP COLUMN "episode_number",
ADD COLUMN     "order" INTEGER NOT NULL;
