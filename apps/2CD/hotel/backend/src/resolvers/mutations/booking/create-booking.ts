import { GraphQLError } from 'graphql';
import { Booking } from 'src/models/booking';

interface BookingInput {
  totalPrice: number;
  bookStatus: string;
  startDate: string;
  endDate: string;
  user: string;
  room: string;
  hotel: string;
}

const defaultValues = {
  room: [],
  user: [],
};

const createBookingData = (input: BookingInput) => ({
  ...defaultValues,
  ...input,
});

export const CreateBooking = async (_parent: unknown, { input }: { input: BookingInput }) => {
  try {
    const bookingData = createBookingData(input);
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();
    return savedBooking;
  } catch (error) {
    console.error('Error in CreateBooking mutation:', error);
    throw new GraphQLError('Failed to create booking: Unknown error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        originalError: error,
        timestamp: new Date().toISOString(),
        inputData: input,
      },
    });
  }
};
