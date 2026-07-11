/*
  Warnings:

  - The values [APPROVED] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('PENDING', 'ANSWERED', 'REJECTED');
ALTER TABLE "public"."contacts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "contacts" ALTER COLUMN "status" TYPE "ContactStatus_new" USING ("status"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "public"."ContactStatus_old";
ALTER TABLE "contacts" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "rejected_detail" TEXT;
