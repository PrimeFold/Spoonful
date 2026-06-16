import { afterEach, beforeEach, describe, expect, it, vi, beforeAll } from "vitest";

const mockRedis: any = {
  get: vi.fn(),
  setex: vi.fn(),
};

const mockRepository: any = {
  findLocation: vi.fn(),
  createLocation: vi.fn(),
  findDuplicate: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
};

vi.mock("../lib/redis", () => ({
  __esModule: true,
  redis: mockRedis,
}));

vi.mock("../api/food_spots/fs.repository", () => ({
  __esModule: true,
  FoodSpotRepository: mockRepository,
}));

vi.mock("../mapper/fs.mapper", () => ({
  __esModule: true,
  foodSpotToDTO: (spot: any) => ({
    id: spot.id,
    name: spot.name,
    location: spot.location,
    spotRating: spot.spotRating,
    tags: spot.tags,
    userid: spot.userId,
    status: spot.status,
    createAt: spot.createdAt?.toISOString(),
  }),
}));

vi.mock("../lib/filter", () => ({
  __esModule: true,
  buildFoodSpotFilters: vi.fn(() => ({})),
  buildUserSubmissionsFilters: vi.fn(() => ({})),
}));

let getAllFoodSpots: typeof import("../api/food_spots/fs.service").getAllFoodSpots;
let AddFoodSpotService: typeof import("../api/food_spots/fs.service").AddFoodSpotService;

describe("food spot service", () => {
  // Import after mocks so the service uses the fake Redis and fake repository.
  beforeAll(async () => {
    const service = await import("../api/food_spots/fs.service");
    getAllFoodSpots = service.getAllFoodSpots;
    AddFoodSpotService = service.AddFoodSpotService;
  });

  beforeEach(() => {
    // Reset every mock before each test so the next case starts clean.
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns cached food spots when redis already has the response", async () => {
    // A cache hit should skip the database entirely.
    mockRedis.get.mockResolvedValue(
      JSON.stringify({
        items: [{ id: "spot-1", name: "Cached Spot" }],
        pagination: { page: 1, limit: 10, total: 1, hasMore: false },
      })
    );

    const result = await getAllFoodSpots({
      page: 1,
      limit: 10,
      search: "tiffin",
      tags: [],
      rating: undefined,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("CACHE HIT");
    expect(mockRepository.findMany).not.toHaveBeenCalled();
  });

  it("fetches, shapes, and caches food spots when cache is empty", async () => {
    // On cache miss, the service should query the repository and cache the final payload.
    mockRedis.get.mockResolvedValue(null);
    mockRepository.findMany.mockResolvedValue([
      {
        id: "spot-1",
        name: "Campus Corner",
        location: {
          locality: "Main Road",
          town: null,
          city: "Indore",
          state: "MP",
        },
        spotRating: "FOURSTAR",
        tags: ["VEG"],
        status: "PENDING",
        userId: "user-1",
        createdAt: new Date("2026-06-12T00:00:00.000Z"),
      },
    ]);
    mockRepository.count.mockResolvedValue(1);

    const result = await getAllFoodSpots({
      page: 1,
      limit: 10,
      search: "campus",
      tags: ["VEG"],
      rating: "FOURSTAR",
    });

    expect(result.success).toBe(true);
    expect(result.data?.items[0]).toMatchObject({
      id: "spot-1",
      name: "Campus Corner",
      userid: "user-1",
      status: "PENDING",
      createAt: "2026-06-12T00:00:00.000Z",
    });
    expect(mockRedis.setex).toHaveBeenCalledTimes(1);
  });

  it("adds a new food spot when the location and name are valid", async () => {
    // This checks the happy path for adding a spot, including location reuse and duplicate detection.
    mockRepository.findLocation.mockResolvedValue({
      id: "location-1",
    });
    mockRepository.findDuplicate.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({
      id: "spot-1",
      name: "Nandini",
      location: { locality: "Main Road", city: "Indore", state: "MP" },
      spotRating: "FOURSTAR",
      tags: ["VEG"],
    });

    const result = await AddFoodSpotService("user-1", {
      name: "Nandini",
      location: {
        locality: "Main Road",
        city: "Indore",
        state: "MP",
      },
      spotRating: "FOURSTAR",
      tags: ["VEG"],
    } as any);

    expect(result.success).toBe(true);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it("rejects duplicate food spots before creating anything", async () => {
    // If the name/location already exists, the service should stop early.
    mockRepository.findLocation.mockResolvedValue({
      id: "location-1",
    });
    mockRepository.findDuplicate.mockResolvedValue({
      id: "spot-dup",
    });

    const result = await AddFoodSpotService("user-1", {
      name: "Nandini",
      location: {
        locality: "Main Road",
        city: "Indore",
        state: "MP",
      },
      spotRating: "FOURSTAR",
      tags: ["VEG"],
    } as any);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Food spot already exists");
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
