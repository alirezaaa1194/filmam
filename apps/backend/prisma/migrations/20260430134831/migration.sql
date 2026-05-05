/*
  Warnings:

  - You are about to drop the column `combined_tag` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "combined_tag",
ADD COLUMN     "combined_tags" TEXT;
