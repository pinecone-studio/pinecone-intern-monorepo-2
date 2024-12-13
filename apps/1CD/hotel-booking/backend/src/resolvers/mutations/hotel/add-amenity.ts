import { GraphQLError } from 'graphql';
import { amenitiesModel } from '../../../models';
import { AmenityTypeInput } from '../../../generated';

export const addAmenity = async (_: unknown, { input }: { input: AmenityTypeInput }) => {
  try {
    const createdAmenity = await amenitiesModel.create({
      ...input,
      createdAt: new Date(),
    });
    return createdAmenity;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
