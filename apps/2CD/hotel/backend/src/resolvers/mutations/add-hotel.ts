import { Hotel } from '../../models/hotel';
import { GraphQLError } from 'graphql';

interface AddHotelInput {
  hotelName: string;
  price: number;
  description: string;
  phoneNumber: string;
  amenities?: string[];
  rooms?: string[];
  hotelStar?: number;
  guestReviews?: string[];
  bookings?: string[];
  roomServices?: string[];
}

const defaultValues = {
  amenities: [],
  rooms: [],
  guestReviews: [],
  bookings: [],
  roomServices: [],
};

const createHotelData = (input: AddHotelInput) => ({
  ...defaultValues,
  ...input,
});

export const addHotel = async (_parent: unknown, { input }: { input: AddHotelInput }) => {
  try {
    const hotelData = createHotelData(input);
    const newHotel = new Hotel(hotelData);
    const savedHotel = await newHotel.save();
    return savedHotel;
  } catch (error) {
    console.error('Error in addHotel mutation:', error);
    throw new GraphQLError(
      error instanceof Error ? `Failed to add hotel: ${error.message}` : 'Failed to add hotel: Unknown error'
    );
  }
};