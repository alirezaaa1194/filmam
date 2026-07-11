/*
  Warnings:

  - You are about to drop the column `body` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `contacts` table. All the data in the column will be lost.
  - Added the required column `is_registered` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_user_id_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "body",
DROP COLUMN "parent_id",
DROP COLUMN "subject",
DROP COLUMN "user_id",
ADD COLUMN     "answer_message" TEXT,
ADD COLUMN     "is_registered" BOOLEAN NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "user_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
