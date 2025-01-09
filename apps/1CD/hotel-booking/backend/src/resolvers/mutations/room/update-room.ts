import { UpdateRoomInfoInput } from 'src/generated';
import { roomsModel } from 'src/models';

export const updateRoomInfo = async (_: unknown, { input }: { input: UpdateRoomInfoInput }) => {
  const { _id, ...updateData } = input;

  if (!_id) {
    throw new Error('Room ID (_id) is required for updating room info');
  }

  try {
    const updatedRoom = await roomsModel.findByIdAndUpdate({ _id }, { ...updateData }, { new: true });
    if (!updatedRoom) {
      throw new Error(`Failed to update room with ID: ${_id}`);
    }
    return updatedRoom;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
