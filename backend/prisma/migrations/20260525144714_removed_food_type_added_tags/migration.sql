/*
  Warnings:

  - You are about to drop the column `foodType` on the `FoodSpots` table. All the data in the column will be lost.
  - Added the required column `tags` to the `FoodSpots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tags" AS ENUM ('TIFFIN', 'NON_VEG', 'VEG', 'SNACKS', 'LATE_NIGHT', 'HOME_STYLE', 'BUDGET', 'NORTH_INDIAN', 'SOUTH_INDIAN');

-- AlterTable
ALTER TABLE "FoodSpots" DROP COLUMN "foodType",
ADD COLUMN     "tags" "Tags" NOT NULL;

-- DropEnum
DROP TYPE "FoodType";
