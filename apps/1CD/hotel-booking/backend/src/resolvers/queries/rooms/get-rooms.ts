import { roomsModel } from 'src/models';

export const getRooms = async () => {
  try {
    const rooms = await roomsModel.find().populate('hotelId');
    return rooms;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
