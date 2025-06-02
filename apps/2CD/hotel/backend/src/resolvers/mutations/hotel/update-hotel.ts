import { GraphQLError } from 'graphql';
import { Hotel } from 'src/models/hotel';
import { MongooseError } from 'mongoose';

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
  roomServices?: string[];
  images?: string[];
}

const handleUpdateError = (error: MongooseError | GraphQLError): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError(`Failed to update hotel: ${error.message}`);
};

export const updateHotel = async (
  _parent: unknown, 
  { input, id }: { input: UpdateHotelInput; id: string }
) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { ...input, images: input.images || [] },
      { new: true, runValidators: true }
    );

    if (!updatedHotel) {
      throw new GraphQLError('Hotel not found');
    }

    return updatedHotel;
  } catch (error) {
    handleUpdateError(error as MongooseError | GraphQLError);
  }
};
