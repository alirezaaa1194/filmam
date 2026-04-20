/*
  Warnings:

  - You are about to drop the column `season_id` on the `user_movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_movies" DROP CONSTRAINT "user_movies_season_id_fkey";

-- AlterTable
ALTER TABLE "user_movies" DROP COLUMN "season_id",
ADD COLUMN     "episode_id" INTEGER;

-- AddForeignKey
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
