/*
  Warnings:

  - You are about to drop the column `likes_percent` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "dislikes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "watches_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "likes_percent",
ADD COLUMN     "dislikes_count" INTEGER NOT NULL DEFAULT 0;
