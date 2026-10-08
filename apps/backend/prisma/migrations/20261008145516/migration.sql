/*
  Warnings:

  - A unique constraint covering the columns `[user_id,episode_id,type]` on the table `user_movies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_movies_user_id_episode_id_type_key" ON "user_movies"("user_id", "episode_id", "type");
