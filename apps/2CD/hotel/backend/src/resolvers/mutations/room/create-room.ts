import { Room } from "src/models/room.model";
interface RoomInput{
  roomNumber: number
  price: string
  description: string
  roomImage: string[]
  isAvailable: string
  bedType: string
  numberOfBed: number
}
export const createRoom = async (_parent: unknown, { input }:{input:RoomInput }) => {
  try {
    const newRoom = new Room({
      roomNumber: input.roomNumber,
      price: input.price,
      description: input.description,
      roomImage: input.roomImage,
      isAvailable: input.isAvailable,
      bedType: input.bedType,
      numberOfBed: input.numberOfBed,
    });

    const savedRoom = await newRoom.save();

    return {
  success: true,
  message: "Room created successfully",
  data: {
savedRoom
  },
};
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};