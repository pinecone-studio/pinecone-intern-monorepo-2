import { GraphQLError } from 'graphql';
import { Booking } from 'src/generated';
import { fetchAndProcessBookings } from '../../../utils/booking-data-fetcher';
import { handleDataIntegrityError, handleConnectionError, handleGenericError } from '../../../utils/booking-helpers';

const handleDataIntegrityErrors = (error: Error): void => {
  if (error.message.includes('Cannot return null for non-nullable field')) {
    handleDataIntegrityError(error);
  }
};

const handleTimeoutErrors = (error: Error): void => {
  if (error.message.includes('Database query timed out')) {
    throw new GraphQLError('Database query timed out. Please try again.', {
      extensions: {
        code: 'QUERY_TIMEOUT',
        originalError: error.message,
        suggestion: 'The database is experiencing high load. Please retry your request.'
      },
    });
  }
  
  if (error.message.includes('timed out')) {
    throw new GraphQLError('Database operation timed out. Please try again.', {
      extensions: {
        code: 'OPERATION_TIMEOUT',
        originalError: error.message,
        suggestion: 'The database operation is taking longer than expected. Please retry your request.'
      },
    });
  }
};

const handleConnectionErrors = (error: Error): void => {
  if (error.message.includes('Database connection is not available')) {
    handleConnectionError();
  }
};

// Helper function to handle specific error types
const handleSpecificErrors = (error: Error): void => {
  handleDataIntegrityErrors(error);
  handleTimeoutErrors(error);
  handleConnectionErrors(error);
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
    
    if (error instanceof Error) {
      handleSpecificErrors(error);
    }
    
    return handleGenericError(error);
  }
};