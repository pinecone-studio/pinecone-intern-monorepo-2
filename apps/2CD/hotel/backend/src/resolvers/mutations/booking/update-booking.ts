import { GraphQLError } from 'graphql';
import { Booking } from 'src/models/booking';

interface UpdateBookingInput {
  totalPrice: number;
  bookStatus: string;
}

export const updateBooking = async (
  _parent: unknown,
  { input, id }: { input: UpdateBookingInput; id: string }
) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      throw new GraphQLError('Booking not found', {
        extensions: {
          code: 'NOT_FOUND',
          inputData: input,
        },
      });
    }

    return updatedBooking;
  } catch (error: any) {
    if (error instanceof GraphQLError) {
      // Re-throw GraphQLError as is (like 'Booking not found')
      throw error;
    }
    // Wrap other unexpected errors
    throw new GraphQLError(`Failed to update booking: ${error.message}`, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        inputData: input,
        originalError: error,
      },
    });
  }
};
