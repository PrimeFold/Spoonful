-- CreateEnum
CREATE TYPE "SpotRating" AS ENUM ('ONESTAR', 'TWOSTAR', 'THREESTAR', 'FOURSTAR', 'FIVESTAR');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('FULL_COURSE', 'FAST_FOOD');

-- CreateTable
CREATE TABLE "FoodSpots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "spotRating" "SpotRating" NOT NULL,
    "foodType" "FoodType" NOT NULL,

    CONSTRAINT "FoodSpots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodSpotsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FoodSpotsToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FoodSpotsToUser_B_index" ON "_FoodSpotsToUser"("B");

-- AddForeignKey
ALTER TABLE "_FoodSpotsToUser" ADD CONSTRAINT "_FoodSpotsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FoodSpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodSpotsToUser" ADD CONSTRAINT "_FoodSpotsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
