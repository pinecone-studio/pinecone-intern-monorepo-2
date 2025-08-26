import { GraphQLError } from 'graphql';
import { PlainBooking } from '../types/booking.types';

// Helper function to check if we're in test environment
export const isTestEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

// Helper function to get connection state description
const getConnectionStateStatus = (readyState: number): boolean => {
  switch (readyState) {
    case 1:
      return true; // Connected
    case 2:
      console.log('⏳ MongoDB connection is still establishing...');
      return false;
    case 0:
      console.error('❌ MongoDB connection is disconnected');
      return false;
    default:
      return false;
  }
};

// Helper function to check MongoDB connection status
export const checkConnectionStatus = async (): Promise<boolean> => {
  if (isTestEnvironment()) {
    return true;
  }
  
  try {
    const mongoose = await import('mongoose');
    return getConnectionStateStatus(mongoose.connection.readyState);
  } catch (error) {
    console.error('❌ Error checking connection status:', error);
    return false;
  }
};

// Helper function to log sample booking data
export const logSampleBookingData = (plainBookings: PlainBooking[]): void => {
  if (plainBookings.length > 0) {
    const firstBooking = plainBookings[0];
    console.log('Sample booking data:', {
      id: firstBooking._id,
      adults: firstBooking.adults,
      children: firstBooking.children,
      status: firstBooking.status,
      hasAdults: firstBooking.adults !== null && firstBooking.adults !== undefined && firstBooking.adults >= 0,
      adultsType: typeof firstBooking.adults
    });
  }
};

// Helper function to handle data integrity errors
export const handleDataIntegrityError = (error: Error): never => {
  throw new GraphQLError('Data integrity error: Some booking records have missing required fields. Please run data validation to identify and fix the issues.', {
    extensions: {
      code: 'DATA_INTEGRITY_ERROR',
      originalError: error.message,
      suggestion: 'Run "nx run hotelbooking-2fh-backend:validate-data" to check for data issues'
    },
  });
};

// Helper function to handle connection errors
export const handleConnectionError = (): never => {
  throw new GraphQLError('Database connection is not available. Please try again later.', {
    extensions: {
      code: 'DATABASE_CONNECTION_ERROR',
      suggestion: 'Check if the database service is running and accessible'
    },
  });
};

// Helper function to handle generic errors
export const handleGenericError = (error: unknown): never => {
  throw new GraphQLError('Failed to fetch bookings', {
    extensions: {
      code: 'BOOKINGS_FETCH_FAILED',
      originalError: error instanceof Error ? error.message : 'Unknown error',
    },
  });
};
