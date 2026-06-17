import { getAllFoodSpots } from "../api/food_spots/fs.service";

async function run() {
  try {
    const result = await getAllFoodSpots({ page: 1, limit: 10 });
    console.log("RESULT:", result);
  } catch (error) {
    console.error("CAUGHT ERROR:", error);
  }
}
run();
