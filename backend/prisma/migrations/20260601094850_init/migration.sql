/*
  Warnings:

  - A unique constraint covering the columns `[name,location]` on the table `FoodSpots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "FoodSpots_name_idx" ON "FoodSpots"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FoodSpots_name_location_key" ON "FoodSpots"("name", "location");
