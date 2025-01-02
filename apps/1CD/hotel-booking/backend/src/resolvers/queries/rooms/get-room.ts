import { roomsModel } from 'src/models';

export const getRoom = async (_: unknown, { _id }: { _id: string }) => {
  if (!_id) throw new Error('id must be required');

  const room = await roomsModel.findById({ _id }).populate('hotelId');
  return room;
};
