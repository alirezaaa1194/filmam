/*
  Warnings:

  - You are about to drop the column `season_number` on the `seasons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `seasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `seasons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seasons" DROP COLUMN "season_number",
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_order_key" ON "seasons"("order");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_slug_key" ON "seasons"("slug");
