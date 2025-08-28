import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { Booking } from 'src/generated';
import { transformBookings } from '../../../utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../utils/convert-mongoose';

// Helper function to log sample booking data
const logSampleBookingData = (plainBookings: unknown[]): void => {
  if (plainBookings.length > 0) {
    const firstBooking = plainBookings[0] as Record<string, unknown>;
    console.log('Sample booking data:', {
      id: firstBooking._id,
      adults: firstBooking.adults,
      children: firstBooking.children,
      status: firstBooking.status,
      hasAdults: firstBooking.adults !== null && firstBooking.adults !== undefined,
      adultsType: typeof firstBooking.adults
    });
  }
};

// Helper function to handle data integrity errors
const handleDataIntegrityError = (error: Error): never => {
  throw new GraphQLError('Data integrity error: Some booking records have missing required fields. Please run data validation to identify and fix the issues.', {
    extensions: {
      code: 'DATA_INTEGRITY_ERROR',
      originalError: error.message,
      suggestion: 'Run "nx run hotelbooking-2fh-backend:validate-data" to check for data issues'
    },
  });
};

// Helper function to handle generic errors
const handleGenericError = (error: unknown): never => {
  throw new GraphQLError('Failed to fetch bookings', {
    extensions: {
      code: 'BOOKINGS_FETCH_FAILED',
      originalError: error instanceof Error ? error.message : 'Unknown error',
    },
  });
};

// Helper function to fetch and process bookings
const fetchAndProcessBookings = async (): Promise<Booking[]> => {
  const bookings = await BookingModel.find({}).sort({ createdAt: -1 });
  
  if (!bookings || bookings.length === 0) {
    console.log('No bookings found in database');
    return [];
  }
  
  console.log(`Found ${bookings.length} bookings, transforming data...`);
  
  // Convert Mongoose documents to plain objects and ensure proper structure
  const plainBookings = convertMongooseArrayToPlain(bookings);
  
  // Log the first booking for debugging
  logSampleBookingData(plainBookings);
  
  return transformBookings(plainBookings) as Booking[];
};

export const bookings = async (
  _: unknown,
  __: unknown,
  ___: unknown,
  ____: unknown
): Promise<Booking[]> => {
  try {
    return await fetchAndProcessBookings();
  } catch (error) {
    console.error('Error in bookings resolver:', error);
    
    if (error instanceof Error && error.message.includes('Cannot return null for non-nullable field')) {
      handleDataIntegrityError(error);
    }
    
    // This will always throw, so the function never reaches the end
    return handleGenericError(error);
  }
};
