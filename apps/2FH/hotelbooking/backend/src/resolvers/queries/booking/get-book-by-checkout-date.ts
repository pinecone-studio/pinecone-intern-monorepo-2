import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { transformBookings } from '../../../utils/transform-booking';
import { Booking } from 'src/generated';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';

const validateCheckOutDate = (checkOutDate: string): void => {
  const date = new Date(checkOutDate);
  if (isNaN(date.getTime())) {
    throw new GraphQLError('Invalid check-out date format', { 
      extensions: { code: 'INVALID_DATE_FORMAT' } 
    });
  }
};

const createDateRange = (checkOutDate: string): { start: Date; end: Date } => {
  const start = new Date(checkOutDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(checkOutDate);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const fetchBookingsByDateRange = async (start: Date, end: Date): Promise<Booking[]> => {
  const bookings = await BookingModel.find({ 
    checkOutDate: { $gte: start, $lte: end } 
  }).sort({ createdAt: -1 });
  
  // Convert Mongoose documents to plain objects (handle both types for testing)
  const plainBookings = convertMongooseArrayToPlain(bookings);
  
  return transformBookings(plainBookings) as Booking[];
};

export const getBookingsByCheckOutDate = async (
  _: unknown,
  { checkOutDate }: { checkOutDate: string },
  __: unknown,
  ___: unknown
): Promise<Booking[]> => {
  try {
    validateCheckOutDate(checkOutDate);
    const { start, end } = createDateRange(checkOutDate);
    return await fetchBookingsByDateRange(start, end);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to fetch bookings by check-out date', {
      extensions: { 
        code: 'CHECKOUT_DATE_BOOKINGS_FETCH_FAILED', 
        originalError: error instanceof Error ? error.message : 'Unknown error' 
      },
    });
  }
};
