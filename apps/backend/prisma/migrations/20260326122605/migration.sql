/*
  Warnings:

  - Added the required column `view_mode` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SectionViewMode" AS ENUM ('NORMAL_SLIDER', 'KIDS_SLIDER', 'HERO_LIKE_SLIDER', 'PUZZLE');

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "view_mode" "SectionViewMode" NOT NULL;
