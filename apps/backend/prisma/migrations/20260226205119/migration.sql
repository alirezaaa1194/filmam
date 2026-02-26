/*
  Warnings:

  - Added the required column `source_type` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `mime_type` on the `uploads` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('FROM_FILE', 'FROM_URL');

-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "source_type" "SourceType" NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT,
ALTER COLUMN "height" SET DATA TYPE TEXT,
DROP COLUMN "mime_type",
ADD COLUMN     "mime_type" TEXT NOT NULL,
ALTER COLUMN "size" SET DATA TYPE TEXT,
ALTER COLUMN "width" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "UploadFileType";
