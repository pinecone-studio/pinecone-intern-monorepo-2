import { GraphQLError } from 'graphql';
import { hotelsModel } from '../../../models';
import { HotelInput } from '../../../generated';

export const addHotelGeneralInfo = async (_: unknown, { input }: { input: HotelInput }) => {
  try {
    const createdGeneralInfo = await hotelsModel.create({
      ...input,
      createdAt: new Date(),
    });
    return createdGeneralInfo;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
