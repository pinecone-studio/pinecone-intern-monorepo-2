import { getAllRooms } from "src/resolvers/queries/room/get-all-rooms";
import { Room } from "src/models/room.model";

jest.mock("src/models/room.model");

describe("getAllRoom", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all rooms", async () => {
    const mockRooms = [{ name: "Room A" }, { name: "Room B" }];
    (Room.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRooms),
    });

    const result = await getAllRooms();

    expect(Room.find).toHaveBeenCalled();
    expect(result).toEqual(mockRooms);
  });

  it("should return error response when exception is thrown", async () => {
    (Room.find as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    const result = await getAllRooms();

    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
