// update-booking.ts
import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { UpdateBookingInput, Response } from '../../../generated';
import { mapGraphQLToMongooseBookingStatus } from '../../common/booking-status.mapper';

const prepareUpdateData = (input: UpdateBookingInput): Record<string, unknown> => {
  const updateData: Record<string, unknown> = { ...input };
  if (input.status) {
    updateData.status = mapGraphQLToMongooseBookingStatus(input.status);
  }
  updateData.updatedAt = new Date();
  return updateData;
};

const validateBookingUpdate = (updBooking: unknown): void => {
  if (!updBooking) {
    throw new GraphQLError('Booking not found', {
      extensions: { code: 'BOOKING_NOT_FOUND' }
    });
  }
};

export const updateBooking = async (
  _: unknown,
  { id, input }: { id: string | number; input: UpdateBookingInput },
  __: unknown,
  ___: unknown
): Promise<Response> => {
  try {
    // Transform input data to handle status mapping
    const updateData = prepareUpdateData(input);

    // Convert id to string for MongoDB
    const bookingId = String(id);

    const updBooking = await BookingModel.findByIdAndUpdate(bookingId, updateData, { new: true });

    validateBookingUpdate(updBooking);
   
    return Response.Success;
  } catch (error) {
    // Re-throw GraphQLError if it's already a GraphQLError
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    console.error(error);
    throw new GraphQLError('Cannot update booking', {
      extensions: { code: 'BOOKING_UPDATE_FAILED' }
    });
  }
};