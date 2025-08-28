import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { transformBooking } from '../../../utils/transform-booking';
import { Booking } from 'src/generated';
import { convertMongooseToPlain } from '../../../utils/convert-mongoose';

// MongoDB ObjectId validation regex
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const validateBookingId = (id: string): void => {
  if (!OBJECT_ID_REGEX.test(id)) {
    throw new GraphQLError('Invalid booking ID format', {
      extensions: { code: 'INVALID_ID_FORMAT' }
    });
  }
};

const findBookingById = async (id: string) => {
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new GraphQLError('Booking not found', {
      extensions: { code: 'BOOKING_NOT_FOUND' }
    });
  }
  return booking;
};

export const getBooking = async (
  _: unknown,
  { id }: { id: string },
  __: unknown,
  ___: unknown
): Promise<Booking> => {
  try {
    validateBookingId(id);
    const booking = await findBookingById(id);
    
    // Convert Mongoose document to plain object (handle both types for testing)
    const plainBooking = convertMongooseToPlain(booking);
    
    console.log('getBooking - Raw booking data:', {
      id: plainBooking._id,
      hasId: !!plainBooking._id,
      adults: plainBooking.adults,
      children: plainBooking.children,
      status: plainBooking.status,
      keys: Object.keys(plainBooking)
    });
    
    return transformBooking(plainBooking) as Booking;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to fetch booking', {
      extensions: { code: 'BOOKING_FETCH_FAILED' }
    });
  }
};
