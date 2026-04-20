/*
  Warnings:

  - The values [WATCHED,WATCHING] on the enum `UserMovieType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserMovieType_new" AS ENUM ('BOOKMARK', 'LIKE', 'DISLIKE', 'WATCH');
ALTER TABLE "user_movies" ALTER COLUMN "type" TYPE "UserMovieType_new" USING ("type"::text::"UserMovieType_new");
ALTER TYPE "UserMovieType" RENAME TO "UserMovieType_old";
ALTER TYPE "UserMovieType_new" RENAME TO "UserMovieType";
DROP TYPE "public"."UserMovieType_old";
COMMIT;

-- AlterTable
ALTER TABLE "user_movies" ADD COLUMN     "season_id" INTEGER,
ALTER COLUMN "movie_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
