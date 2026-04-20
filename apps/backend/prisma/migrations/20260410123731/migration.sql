/*
  Warnings:

  - You are about to drop the column `order` on the `roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order]` on the table `movie_factors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `movie_factors` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "roles_order_key";

-- AlterTable
ALTER TABLE "movie_factors" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "order";

-- CreateIndex
CREATE UNIQUE INDEX "movie_factors_order_key" ON "movie_factors"("order");
