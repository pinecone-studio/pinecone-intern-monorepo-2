import { hotelsModel } from 'src/models';

export const getHotel = async (_: unknown, { _id }: { _id: string }) => {
  const oneHotel = hotelsModel.findById({ _id });
  if (!oneHotel) throw new Error('Hotel is not found');
  return oneHotel;
};
