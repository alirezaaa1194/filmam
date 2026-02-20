-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "otps_user_id_used_at_idx" ON "otps"("user_id", "used_at");
