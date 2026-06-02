/*
  Warnings:

  - You are about to drop the column `location` on the `FoodSpots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `FoodSpots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `FoodSpots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `FoodSpots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FoodSpots_name_location_key";

-- AlterTable
ALTER TABLE "FoodSpots" DROP COLUMN "location",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "town" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodSpots_locationId_key" ON "FoodSpots"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodSpots_name_key" ON "FoodSpots"("name");

-- AddForeignKey
ALTER TABLE "FoodSpots" ADD CONSTRAINT "FoodSpots_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
