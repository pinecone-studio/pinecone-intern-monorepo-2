import { Room } from 'src/models/room.model';
interface RoomService {
  bathroom: string[];
  accesibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  bedroom: string[];
}
interface RoomInput {
  roomNumber: number;
  price: string;
  description: string;
  roomImage: string[];
  isAvailable: string;
  bedType: string;
  numberOfBed: number;
  hotel?: string;
  roomService: RoomService;
}
export const updateRoom = async (_parent: unknown, { input, id }: { input: RoomInput; id: string }) => {
  try {
    const updateRoom = await Room.findByIdAndUpdate(id, {
      roomNumber: input.roomNumber,
      price: input.price,
      description: input.description,
      roomImage: input.roomImage,
      isAvailable: input.isAvailable,
      bedType: input.bedType,
      numberOfBed: input.numberOfBed,
      hotel: input.hotel,
      roomService: input.roomService,
    });

    const savedRoom = await updateRoom.save();

    return {
      success: true,
      message: 'Room update successfully',
      data: {
        savedRoom,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};
