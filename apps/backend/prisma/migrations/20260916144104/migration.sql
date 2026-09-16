/*
  Warnings:

  - A unique constraint covering the columns `[user_id,movie_id,type,episode_id]` on the table `user_movies` will be added. If there are existing duplicate values, this will fail.
  - Made the column `episode_id` on table `user_movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_movies" ALTER COLUMN "episode_id" SET NOT NULL,
ALTER COLUMN "episode_id" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "user_movies_user_id_movie_id_type_episode_id_key" ON "user_movies"("user_id", "movie_id", "type", "episode_id");
