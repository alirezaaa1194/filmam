/*
  Warnings:

  - You are about to drop the column `role_name` on the `movie_factors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movie_factors" DROP COLUMN "role_name";

-- CreateTable
CREATE TABLE "movie_factor_translations" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_name" TEXT NOT NULL,
    "movie_factor_id" INTEGER NOT NULL,
    "language" "AppLanguage" NOT NULL,

    CONSTRAINT "movie_factor_translations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movie_factor_translations" ADD CONSTRAINT "movie_factor_translations_movie_factor_id_fkey" FOREIGN KEY ("movie_factor_id") REFERENCES "movie_factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
