import { Room } from "src/models/room.model";
interface RoomService{
   bathroom: string[];
  accesibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  bedroom: string[];
}
interface RoomInput{
  roomNumber: number
  price: string
  description: string
  roomImage: string[]
  isAvailable: string
  bedType: string
  numberOfBed: number
  hotel:string
  roomService:RoomService
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
      hotel:input.hotel,
      roomService:input.roomService
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
    return {
      success: false,
      data: null,
    };
  }
};