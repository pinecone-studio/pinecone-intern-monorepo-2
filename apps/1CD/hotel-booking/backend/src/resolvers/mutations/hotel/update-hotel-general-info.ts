import { HotelInput } from 'src/generated';
import { hotelsModel } from 'src/models';

export const updateHotelGeneralInfo = async (_: unknown, { _id, input }: { _id: string; input: HotelInput }) => {
  if (!_id) throw new Error('id must required');
  const updatedHotel = await hotelsModel.findByIdAndUpdate({ _id }, { ...input });
  return updatedHotel;
};
