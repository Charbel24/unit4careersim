const request = require("supertest");
const { app, prisma } = require("../app");

jest.mock("@prisma/client");

describe("Item CRUD Operations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/items - Create item", async () => {
    const mockItem = {
      title: "Nice Phone"
    };

    console.log("prisma.item: ",prisma);
    
    await prisma.item.create({data: mockItem});

    const response = await request(app)
      .post("/api/items")
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.title).toEqual(mockItem.title);
  });
});
