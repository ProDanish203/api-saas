/*
  Warnings:

  - A unique constraint covering the columns `[userId,month]` on the table `ApiUsage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `ApiUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiUsage" ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "ApiUsage_userId_month_idx" ON "ApiUsage"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsage_userId_month_key" ON "ApiUsage"("userId", "month");
