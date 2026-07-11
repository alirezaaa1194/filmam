/*
  Warnings:

  - You are about to drop the column `headerMenuId` on the `section_filters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "section_filters" DROP CONSTRAINT "section_filters_headerMenuId_fkey";

-- AlterTable
ALTER TABLE "header_menus" ADD COLUMN     "parent_id" INTEGER;

-- AlterTable
ALTER TABLE "section_filters" DROP COLUMN "headerMenuId";

-- AddForeignKey
ALTER TABLE "header_menus" ADD CONSTRAINT "header_menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "header_menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
