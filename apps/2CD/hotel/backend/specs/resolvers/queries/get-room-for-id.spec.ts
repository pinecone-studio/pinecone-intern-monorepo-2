import { getRoomForId } from 'src/resolvers/queries/room/get-room-for-id'
import { Room } from "src/models/room.model";

jest.mock("src/models/room.model");

describe("getRoomForId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a room by id", async () => {
    const mockRoom = { id: "abc123", name: "Deluxe Suite" };
    (Room.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRoom),
    });

    const result = await getRoomForId("abc123");

    expect(Room.findById).toHaveBeenCalledWith("abc123");
    expect(result).toEqual(mockRoom);
  });

  it("should handle errors gracefully", async () => {
    (Room.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    const result = await getRoomForId(("bad-id"));

    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
