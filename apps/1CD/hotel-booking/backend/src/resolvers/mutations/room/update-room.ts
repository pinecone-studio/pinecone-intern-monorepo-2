import { UpdateRoomInfoInput } from 'src/generated';
import { roomsModel } from 'src/models';

export const updateRoomInfo = async (_: unknown, { input }: { input: UpdateRoomInfoInput }) => {
  const { _id, ...updateData } = input;

  try {
    const updatedRoom = await roomsModel.findByIdAndUpdate({ _id }, { ...updateData }, { new: true });
    return updatedRoom;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
