/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `factors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `factors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "factors" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "factors_slug_key" ON "factors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roles_order_key" ON "roles"("order");
