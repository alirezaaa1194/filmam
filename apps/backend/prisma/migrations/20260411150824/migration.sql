/*
  Warnings:

  - Made the column `seasons_count` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "seasons_count" SET NOT NULL,
ALTER COLUMN "seasons_count" SET DEFAULT 1;
