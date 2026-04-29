/*
  Warnings:

  - Added the required column `short_description` to the `episode_translations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EpisodeFileType" ADD VALUE 'COVER';

-- AlterTable
ALTER TABLE "episode_translations" ADD COLUMN     "short_description" TEXT NOT NULL;
