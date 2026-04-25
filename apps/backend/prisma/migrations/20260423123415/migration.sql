-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes_percent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "watches_count" INTEGER NOT NULL DEFAULT 0;
