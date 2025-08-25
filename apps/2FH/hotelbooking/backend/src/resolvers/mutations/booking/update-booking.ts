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

const validateRequiredParameters = (args: { updateBookingId?: string; input?: UpdateBookingInput }): void => {
  if (!args.updateBookingId) {
    throw new GraphQLError('updateBookingId is required', {
      extensions: { code: 'MISSING_REQUIRED_PARAMETER' }
    });
  }

  if (!args.input) {
    throw new GraphQLError('input is required', {
      extensions: { code: 'MISSING_REQUIRED_PARAMETER' }
    });
  }
};

const handleUpdateError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  
  console.error(error);
  throw new GraphQLError('Cannot update booking', {
    extensions: { code: 'BOOKING_UPDATE_FAILED' }
  });
};

export const updateBooking = async (
  _: unknown,
  args: { updateBookingId?: string; input?: UpdateBookingInput },
  __: unknown,
  ___: unknown
): Promise<Response> => {
  try {
    validateRequiredParameters(args);
    const { updateBookingId, input } = args;

    // TypeScript knows these are defined after validation
    const updateData = prepareUpdateData(input as UpdateBookingInput);
    const updBooking = await BookingModel.findByIdAndUpdate(updateBookingId as string, updateData, { new: true });

    validateBookingUpdate(updBooking);
    return Response.Success;
  } catch (error) {
    return handleUpdateError(error);
  }
};