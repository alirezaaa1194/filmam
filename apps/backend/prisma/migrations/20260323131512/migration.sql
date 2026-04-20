/*
  Warnings:

  - Added the required column `entity_type` to the `user_movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_movies" ADD COLUMN     "entity_type" "CommentEntityType" NOT NULL;
