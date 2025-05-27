import { Hotel } from '../../models/hotel';
import { GraphQLError } from 'graphql';

export const getAllHotels = async () => {
  try {
    const hotels = await Hotel.find().exec();
    return hotels;
  } catch (error) {
    throw new GraphQLError(
      error instanceof Error ? `Failed to fetch hotels: ${error.message}` : 'Failed to fetch hotels: Unknown error'
    );
  }
};
