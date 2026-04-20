/*
  Warnings:

  - The values [WATCH] on the enum `UserMovieType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserMovieType_new" AS ENUM ('BOOKMARK', 'LIKE', 'DISLIKE', 'WATCHING', 'WATCHED');
ALTER TABLE "user_movies" ALTER COLUMN "type" TYPE "UserMovieType_new" USING ("type"::text::"UserMovieType_new");
ALTER TYPE "UserMovieType" RENAME TO "UserMovieType_old";
ALTER TYPE "UserMovieType_new" RENAME TO "UserMovieType";
DROP TYPE "public"."UserMovieType_old";
COMMIT;
