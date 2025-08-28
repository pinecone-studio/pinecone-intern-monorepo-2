import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { Response } from '../../../generated';

const validateBookingId = (id: string): void => {
  if (!id || typeof id !== 'string') {
    throw new GraphQLError('Invalid booking ID', {
      extensions: { code: 'INVALID_ID' }
    });
  }
};

const checkBookingExists = async (id: string): Promise<void> => {
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new GraphQLError('Booking not found', {
      extensions: { code: 'BOOKING_NOT_FOUND' }
    });
  }
};

const deleteBookingFromDB = async (id: string): Promise<void> => {
  await BookingModel.findByIdAndDelete(id);
};

const handleValidationError = (error: Error): never => {
  throw new GraphQLError(`Validation failed: ${error.message}`, {
    extensions: { code: 'VALIDATION_ERROR' }
  });
};

const handleGenericError = (error: unknown): never => {
  throw new GraphQLError('Failed to delete booking', {
    extensions: {
      code: 'BOOKING_DELETION_FAILED',
      originalError: error instanceof Error ? error.message : 'Unknown error'
    }
  });
};

const handleErrors = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }

  if (error instanceof Error && error.name === 'ValidationError') {
    return handleValidationError(error);
  }

  return handleGenericError(error);
};

export const deleteBooking = async (
  _: unknown,
  { id }: { id: string },
  __: unknown,
  ___: unknown
): Promise<Response> => {
  try {
    validateBookingId(id);
    await checkBookingExists(id);
    await deleteBookingFromDB(id);
    return Response.Success;
  } catch (error) {
    return handleErrors(error);
  }
};
