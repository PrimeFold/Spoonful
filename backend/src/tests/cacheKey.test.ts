import { generateAllSpotsKey, generatePendingSpotsKey, generateUserSpotsKey } from "../utils/cacheKey";

describe("cacheKey helpers", () => {
  // A cache key should be stable for the same logical query, even if input spacing differs.
  it("normalizes search and filters when generating the all-spots cache key", () => {
    const key = generateAllSpotsKey("  Tiffin  ", ["VEG", "BUDGET"], undefined, 2, 10);

    expect(key).toBe("food-spots:tiffin:BUDGET,VEG:all:2:10");
  });

  // User-specific cache keys must include the user id, or one user's results could leak into another's cache.
  it("includes the user id when generating a user submissions cache key", () => {
    const key = generateUserSpotsKey("user-1", "  north  ", ["SNACKS"], "FOURSTAR", 1, 5);

    expect(key).toBe("user-submissions:user-1:north:SNACKS:FOURSTAR:1:5");
  });

  // The pending queue needs a very simple cache key because it is invalidated frequently.
  it("creates a simple pending food spots cache key", () => {
    expect(generatePendingSpotsKey(1, 6)).toBe("pending-food-spots:1:6");
  });
});
