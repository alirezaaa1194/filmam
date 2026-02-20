/*
  Warnings:

  - Added the required column `language` to the `episode_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `genre_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `role_translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `season_translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episode_translations" ADD COLUMN     "language" "AppLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "genre_translations" ADD COLUMN     "language" "AppLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "role_translations" ADD COLUMN     "language" "AppLanguage" NOT NULL;

-- AlterTable
ALTER TABLE "season_translation" ADD COLUMN     "language" "AppLanguage" NOT NULL;
