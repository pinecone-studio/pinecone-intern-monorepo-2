import { UpdateRoomService } from 'src/generated';
import { roomsModel } from 'src/models';

export const updateRoomService = async (_: unknown, { input }: { input: UpdateRoomService }) => {
  const { _id, ...updateData } = input;

  try {
    const updatedRoom = await roomsModel.findByIdAndUpdate({ _id }, { ...updateData }, { new: true });
    return updatedRoom;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
