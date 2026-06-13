import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

const redisMock: any = {
  get: jest.fn(),
  setex: jest.fn(),
};

const repositoryMock: any = {
  findLocation: jest.fn(),
  createLocation: jest.fn(),
  findDuplicate: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
};

jest.mock("../lib/redis", () => ({
  __esModule: true,
  redis: redisMock,
}));

jest.mock("../api/food_spots/fs.repository", () => ({
  __esModule: true,
  FoodSpotRepository: repositoryMock,
}));

jest.mock("../mapper/fs.mapper", () => ({
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

jest.mock("../lib/filter", () => ({
  __esModule: true,
  buildFoodSpotFilters: jest.fn(() => ({})),
  buildUserSubmissionsFilters: jest.fn(() => ({})),
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
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns cached food spots when redis already has the response", async () => {
    // A cache hit should skip the database entirely.
    redisMock.get.mockResolvedValue(
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
    expect(repositoryMock.findMany).not.toHaveBeenCalled();
  });

  it("fetches, shapes, and caches food spots when cache is empty", async () => {
    // On cache miss, the service should query the repository and cache the final payload.
    redisMock.get.mockResolvedValue(null);
    repositoryMock.findMany.mockResolvedValue([
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
    repositoryMock.count.mockResolvedValue(1);

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
    expect(redisMock.setex).toHaveBeenCalledTimes(1);
  });

  it("adds a new food spot when the location and name are valid", async () => {
    // This checks the happy path for adding a spot, including location reuse and duplicate detection.
    repositoryMock.findLocation.mockResolvedValue({
      id: "location-1",
    });
    repositoryMock.findDuplicate.mockResolvedValue(null);
    repositoryMock.create.mockResolvedValue({
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
    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it("rejects duplicate food spots before creating anything", async () => {
    // If the name/location already exists, the service should stop early.
    repositoryMock.findLocation.mockResolvedValue({
      id: "location-1",
    });
    repositoryMock.findDuplicate.mockResolvedValue({
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
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
});
