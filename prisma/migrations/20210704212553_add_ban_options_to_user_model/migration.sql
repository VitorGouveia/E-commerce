-- AlterTable
ALTER TABLE "User" ADD COLUMN "ban" BOOLEAN;
ALTER TABLE "User" ADD COLUMN "reason_for_ban" TEXT;
ALTER TABLE "User" ADD COLUMN "shadow_ban" BOOLEAN;
