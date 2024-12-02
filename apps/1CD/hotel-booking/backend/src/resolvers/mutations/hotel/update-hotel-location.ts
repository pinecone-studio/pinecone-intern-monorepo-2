import { MutationResolvers } from '../../../generated';
import { hotelsModel } from '../../../models';

export const updateHotelLocation: MutationResolvers['updateHotelLocation'] = async (_, { _id, location }) => {
  const updateHotelLocation = await hotelsModel.findByIdAndUpdate({ _id }, { location });

  if (!updateHotelLocation) {
    throw new Error('Error to update location');
  }

  return updateHotelLocation;
};
