/*
  Warnings:

  - You are about to drop the column `verifiedById` on the `FoodSpots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodSpots" DROP COLUMN "verifiedById",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
