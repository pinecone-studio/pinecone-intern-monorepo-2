import { Room } from "src/models/room.model";

export const getRoomForId = async ( id: string) => {
  try {
    const getRoom = await Room.findById(id).exec();
    return getRoom;
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
}
