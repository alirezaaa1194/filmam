/*
  Warnings:

  - Made the column `short_description` on table `season_translation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "season_translation" ALTER COLUMN "short_description" SET NOT NULL;
