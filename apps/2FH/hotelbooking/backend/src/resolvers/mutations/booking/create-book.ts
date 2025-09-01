import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { CreateBookingInput, Booking } from '../../../generated';
import { mapGraphQLToMongooseBookingStatus } from '../../common/booking-status.mapper';

const validateDateRange = (checkInDate: string, checkOutDate: string): void => {
  if (new Date(checkOutDate) <= new Date(checkInDate)) {
    throw new Error('Check-out date must be after check-in date');
  }
};

// const validateGuestCount = (adults: number, children: number): void => {
//   if (adults < 1) {
//     throw new GraphQLError('At least one adult is required', {
//       extensions: { code: 'INVALID_GUEST_COUNT' },
//     });
//   }

//   if (children < 0) {
//     throw new GraphQLError('Children count cannot be negative', {
//       extensions: { code: 'INVALID_GUEST_COUNT' },
//     });
//   }
// };

const validateCheckInDate = (checkInDate: string): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(checkInDate) < today) {
    throw new GraphQLError('Check-in date cannot be in the past', {
      extensions: { code: 'INVALID_DATE' },
    });
  }
};

const createBookingData = (input: CreateBookingInput) => ({
  ...input,
  status: mapGraphQLToMongooseBookingStatus('BOOKED'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const validateInput = (input: CreateBookingInput): void => {
  const { checkInDate, checkOutDate } = input;
  validateDateRange(checkInDate, checkOutDate);
  // validateGuestCount(adults, children);
  validateCheckInDate(checkInDate);
};

const createBookingInDB = async (input: CreateBookingInput): Promise<any> => {
  const bookingData = createBookingData(input);
  const createdBookingData = await BookingModel.create(bookingData);
  return createdBookingData;
};

// const handleValidationError = (error: Error): never => {
//   throw new GraphQLError(`Validation failed: ${error.message}`, {
//     extensions: { code: 'VALIDATION_ERROR' },
//   });
// };

// const handleGenericError = (error: unknown): never => {
//   throw new GraphQLError('Failed to create booking', {
//     extensions: {
//       code: 'BOOKING_CREATION_FAILED',
//       originalError: error instanceof Error ? error.message : 'Unknown error',
//     },
//   });
// };

// const handleErrors = (error: unknown): never => {
//   if (error instanceof GraphQLError) {
//     throw error;
//   }

//   if (error instanceof Error && error.name === 'ValidationError') {
//     return handleValidationError(error);
//   }

//   // return handleGenericError(error);
// };

export const createBooking = async (_: unknown, { input }: { input: CreateBookingInput }, __: unknown, ___: unknown): Promise<Booking> => {
  try {
    validateInput(input);
    const booking = await createBookingInDB(input);
    return booking as Booking;
  } catch (error) {
    throw new Error(`Data base Error ${error}`);
  }
};
