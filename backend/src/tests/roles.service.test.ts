import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

const redisMock: any = {
  get: jest.fn(),
  setex: jest.fn(),
  keys: jest.fn(),
  del: jest.fn(),
};

const repositoryMock: any = {
  findPendingSpotsPaginated: jest.fn(),
  countPendingSpots: jest.fn(),
  verifyPendingSpot: jest.fn(),
};

const rolesRepositoryMock: any = {
  GetAllAdmins: jest.fn(),
  GetAllStudents: jest.fn(),
  PromoteToAdmin: jest.fn(),
  DemoteToStudent: jest.fn(),
};

jest.mock("../lib/redis", () => ({
  __esModule: true,
  redis: redisMock,
}));

jest.mock("../api/food_spots/fs.repository", () => ({
  __esModule: true,
  FoodSpotRepository: repositoryMock,
}));

jest.mock("../api/roles/roles.repository", () => ({
  __esModule: true,
  RolesRepository: rolesRepositoryMock,
}));

let GetPendingFoodSpotsService: typeof import("../api/roles/roles.service").GetPendingFoodSpotsService;
let VerifyPendingSpotService: typeof import("../api/roles/roles.service").VerifyPendingSpotService;
let GetAllStudentsService: typeof import("../api/roles/roles.service").GetAllStudentsService;
let PromoteToAdminService: typeof import("../api/roles/roles.service").PromoteToAdminService;
let DemoteToStudentService: typeof import("../api/roles/roles.service").DemoteToStudentService;

describe("roles service", () => {
  // Load the service only after mocks are registered so the imported module uses the fake Redis/repository objects.
  beforeAll(async () => {
    const service = await import("../api/roles/roles.service");
    GetPendingFoodSpotsService = service.GetPendingFoodSpotsService;
    VerifyPendingSpotService = service.VerifyPendingSpotService;
    GetAllStudentsService = service.GetAllStudentsService;
    PromoteToAdminService = service.PromoteToAdminService;
    DemoteToStudentService = service.DemoteToStudentService;
  });

  beforeEach(() => {
    // Keep each test isolated so one scenario does not leak mock calls into the next one.
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns cached pending spots when redis has data", async () => {
    // If Redis already has the payload, the service should short-circuit and not hit the repository.
    redisMock.get.mockResolvedValue(
      JSON.stringify({
        items: [{ id: "spot-1", name: "Cached Spot" }],
        pagination: { page: 1, limit: 6, total: 1, hasMore: false },
      })
    );

    const result = await GetPendingFoodSpotsService({ page: 1, limit: 6 });

    expect(result.success).toBe(true);
    expect(result.message).toBe("CACHE HIT");
    expect(result.data).toEqual({
      items: [{ id: "spot-1", name: "Cached Spot" }],
      pagination: { page: 1, limit: 6, total: 1, hasMore: false },
    });
    expect(repositoryMock.findPendingSpotsPaginated).not.toHaveBeenCalled();
  });

  it("fetches pending spots and stores them in redis when cache is empty", async () => {
    // When cache is empty, the service should fetch fresh data and write it back with a short TTL.
    redisMock.get.mockResolvedValue(null);
    repositoryMock.findPendingSpotsPaginated.mockResolvedValue([
      {
        id: "spot-1",
        name: "Campus Corner",
        userId: "user-1",
        location: {
          locality: "Main Road",
          town: null,
          city: "Indore",
          state: "MP",
        },
        spotRating: "FOURSTAR",
        tags: ["VEG"],
        status: "PENDING",
        createdAt: new Date("2026-06-12T00:00:00.000Z"),
      },
    ]);
    repositoryMock.countPendingSpots.mockResolvedValue(1);

    const result = await GetPendingFoodSpotsService({ page: 1, limit: 6 });

    expect(result.success).toBe(true);
    expect(result.data?.items[0]).toMatchObject({
      id: "spot-1",
      name: "Campus Corner",
      userid: "user-1",
      status: "PENDING",
      createAt: "2026-06-12T00:00:00.000Z",
    });
    expect(redisMock.setex).toHaveBeenCalledWith(
      "pending-food-spots:1:6",
      15,
      JSON.stringify(result.data)
    );
  });

  it("invalidates pending queue cache after a verification", async () => {
    // Verifying a spot should clear any pending-queue cache keys so admins do not see stale data.
    redisMock.keys.mockResolvedValue([
      "pending-food-spots:1:6",
      "pending-food-spots:2:6",
    ]);
    repositoryMock.verifyPendingSpot.mockResolvedValue({ id: "spot-1" });

    const result = await VerifyPendingSpotService("spot-1", "VERIFIED");

    expect(result.success).toBe(true);
    expect(redisMock.del).toHaveBeenCalledWith(
      "pending-food-spots:1:6",
      "pending-food-spots:2:6"
    );
  });

  it("returns paginated students", async () => {
    // Owners should get a paginated student list, not a raw unbounded table dump.
    rolesRepositoryMock.GetAllStudents.mockResolvedValue({
      students: [
        {
          id: "user-2",
          name: "Aman",
          email: "aman@example.com",
          image: null,
          role: "STUDENT",
          createdAt: "2026-06-12T00:00:00.000Z",
          updatedAt: "2026-06-12T00:00:00.000Z",
        },
      ],
      total: 1,
    });

    const result = await GetAllStudentsService({ page: 1, limit: 10, search: "aman" });

    expect(result.success).toBe(true);
    expect(result.data?.items).toHaveLength(1);
    expect(result.data?.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      hasMore: false,
    });
  });

  it("promotes and demotes users through the repository layer", async () => {
    // These are the two core role-change actions that the owner dashboard depends on.
    rolesRepositoryMock.PromoteToAdmin.mockResolvedValue({
      id: "user-3",
      name: "Riya",
      email: "riya@example.com",
      image: null,
      role: "ADMIN",
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:00.000Z",
    });
    rolesRepositoryMock.DemoteToStudent.mockResolvedValue({
      id: "user-4",
      name: "Kabir",
      email: "kabir@example.com",
      image: null,
      role: "STUDENT",
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:00.000Z",
    });

    const promoted = await PromoteToAdminService("user-3");
    const demoted = await DemoteToStudentService("user-4");

    expect(promoted.success).toBe(true);
    expect(demoted.success).toBe(true);
    expect(rolesRepositoryMock.PromoteToAdmin).toHaveBeenCalledWith("user-3");
    expect(rolesRepositoryMock.DemoteToStudent).toHaveBeenCalledWith("user-4");
  });
});
