import { MutationResolvers } from '../../../generated';
import { hotelsModel } from '../../../models';

export const updateHotelImages: MutationResolvers['updateHotelImages'] = async (_, { _id, images }) => {
  const updateHotelLocation = await hotelsModel.findByIdAndUpdate({ _id }, { images });

  if (!updateHotelLocation) {
    throw new Error('Error to update Image');
  }

  return updateHotelLocation;
};
