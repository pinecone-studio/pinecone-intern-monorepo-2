import { GraphQLError } from 'graphql';
import { hotelsModel } from '../../../models';
import { AmenityTypeInput } from '../../../generated';

export const addAmenity = async (_: unknown, { input }: { input: AmenityTypeInput }) => {
  try {
    const createdAmenity = await hotelsModel.findByIdAndUpdate(
      { _id: input._id },
      {
        hotelAmenities: input.hotelAmenities,
      }
    );
    return createdAmenity;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
