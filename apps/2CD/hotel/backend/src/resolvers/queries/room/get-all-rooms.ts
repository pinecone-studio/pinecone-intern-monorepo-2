import { Room } from 'src/models/room.model';

export const getAllRooms = async () => {
  try {
    const allRoom = await Room.find().populate('hotel');
    return allRoom;
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};
