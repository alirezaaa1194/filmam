/*
  Warnings:

  - You are about to drop the column `lang` on the `country_translations` table. All the data in the column will be lost.
  - Added the required column `language` to the `country_translations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "country_translations" DROP COLUMN "lang",
ADD COLUMN     "language" "AppLanguage" NOT NULL;
