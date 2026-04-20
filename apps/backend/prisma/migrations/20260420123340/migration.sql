/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movie_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "category_translations" DROP CONSTRAINT "category_translations_category_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_categories" DROP CONSTRAINT "movie_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "movie_categories" DROP CONSTRAINT "movie_categories_movie_id_fkey";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "category_translations";

-- DropTable
DROP TABLE "movie_categories";
