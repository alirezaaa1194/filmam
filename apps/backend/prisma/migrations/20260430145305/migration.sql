/*
  Warnings:

  - Made the column `combined_tags` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "combined_tags" SET NOT NULL;
