/*
  Warnings:

  - Made the column `order` on table `section_movies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "section_movies_order_key";

-- AlterTable
ALTER TABLE "section_movies" ALTER COLUMN "order" SET NOT NULL;

-- CreateTable
CREATE TABLE "section_categories" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "section_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "section_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_tags" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "section_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "section_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_genres" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "section_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "section_genres_pkey" PRIMARY KEY ("id")
);
