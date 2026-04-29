/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `episodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "episodes_slug_key" ON "episodes"("slug");
