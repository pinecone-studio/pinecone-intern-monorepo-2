import { GraphQLError } from 'graphql';
import { Hotel } from 'src/models/hotel';

interface UpdateHotelInput {
  hotelName?: string;
  price?: number;
  description?: string;
  phoneNumber?: string;
  amenities?: string[];
  rooms?: string[];
  hotelStar?: number;
  guestReviews?: string[];
  bookings?: string[];
  images?: string[];
  roomServices?: string[];
  location?: string;
}

export const updateHotel = async (_parent: unknown, { input, id }: { input: UpdateHotelInput; id: string }) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });

    if (!updatedHotel) {
      throw new GraphQLError('Hotel not found');
    }

    return updatedHotel;
  } catch (error: any) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(`Failed to update hotel: ${error.message}`);
  }
};
