import { GetFoodSpotsSchema, GetManagedUsersSchema } from "../lib/zod";

describe("zod schemas", () => {
  // This checks the common path where the frontend sends a search box value with extra spaces.
  it("trims the search query and applies defaults for food spot filters", () => {
    const result = GetFoodSpotsSchema.parse({
      search: "  chowmein  ",
    });

    expect(result.search).toBe("chowmein");
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  // This verifies that pagination query params are coerced from strings and the search string is cleaned.
  it("supports pagination and optional search for managed users", () => {
    const result = GetManagedUsersSchema.parse({
      page: "2",
      limit: "8",
      search: "  aditya  ",
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(8);
    expect(result.search).toBe("aditya");
  });
});
