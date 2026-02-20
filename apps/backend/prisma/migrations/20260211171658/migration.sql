/*
  Warnings:

  - Added the required column `type` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('Login', 'Forget_Password');

-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "type" "OtpType" NOT NULL;

-- CreateTable
CREATE TABLE "login_requests" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "login_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "login_requests" ADD CONSTRAINT "login_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
