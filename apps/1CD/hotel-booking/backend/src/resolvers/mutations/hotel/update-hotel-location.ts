import { MutationResolvers } from '../../../generated';
import { hotelsModel } from '../../../models';

export const updateHotelLocation: MutationResolvers['updateHotelLocation'] = async (_, { _id, location }) => {
  const updatedLocation = await hotelsModel.findByIdAndUpdate({ _id }, { location });

  if (!updatedLocation) {
    throw new Error('Error to update location');
  }
  return updatedLocation;
};
