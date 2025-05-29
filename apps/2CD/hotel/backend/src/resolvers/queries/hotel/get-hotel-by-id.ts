import { Hotel } from '../../../models/hotel';
import { GraphQLError } from 'graphql';
export const getHotelById = async (_parent: unknown, { id }: { id: string }) => {
  try {
    const hotel = await Hotel.findById(id).exec();
    if (!hotel) {
      throw new GraphQLError(`Hotel with id ${id} not found`);
    }
    return hotel;
  } catch (error) {
    throw new GraphQLError(error instanceof Error ? `Failed to fetch hotel: ${error.message}` : 'Failed to fetch hotel: Unknown error');
  }
};
