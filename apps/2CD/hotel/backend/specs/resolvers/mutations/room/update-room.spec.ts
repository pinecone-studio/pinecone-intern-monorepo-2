import { updateRoom } from "src/resolvers/mutations/room/update-room";
import { Room } from "src/models/room.model";

jest.mock("src/models/room.model", () => ({
  Room: {
    findByIdAndUpdate: jest.fn()
  }
}));

describe("updateRoom", () => {
  const mockInput = {
    roomNumber: 101,
    price: "150",
    description: "Updated room",
    roomImage: ["image1.jpg"],
    isAvailable: "true",
    bedType: "Queen",
    numberOfBed: 1,
    hotel: "hotel123",
    roomService: {
      bathroom: ["shower"],
      accesibility: ["elevator"],
      entertainment: ["tv"],
      foodAndDrink: ["coffee maker"],
      bedroom: ["wardrobe"]
    }
  };

  const mockSavedRoom = {
    save: jest.fn().mockResolvedValue("saved-room-data"),
  };

  it("should update a room and return success", async () => {
    (Room.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockSavedRoom);

    const result = await updateRoom(null, { input: mockInput, id: "room-id-1" });

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith("room-id-1", {
      roomNumber: mockInput.roomNumber,
      price: mockInput.price,
      description: mockInput.description,
      roomImage: mockInput.roomImage,
      isAvailable: mockInput.isAvailable,
      bedType: mockInput.bedType,
      numberOfBed: mockInput.numberOfBed,
      hotel: mockInput.hotel,
      roomService: mockInput.roomService,
    });

    expect(mockSavedRoom.save).toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      message: "Room update successfully",
      data: {
        savedRoom: "saved-room-data",
      },
    });
  });

  it("should return failure if update throws error", async () => {
    (Room.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));

    const result = await updateRoom(null, { input: mockInput, id: "room-id-1" });

    expect(result).toEqual({
      success: false,
      data: null,
    });
  });
});
