import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { CreateBookingInput, Booking } from '../../../generated';
import { mapGraphQLToMongooseBookingStatus } from '../../common/booking-status.mapper';

const validateDateRange = (checkInDate: string, checkOutDate: string): void => {
  if (new Date(checkOutDate) <= new Date(checkInDate)) {
    throw new Error('Check-out date must be after check-in date');
  }
};

const validateCheckInDate = (checkInDate: string): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(checkInDate) < today) {
    throw new GraphQLError('Check-in date cannot be in the past', {
      extensions: { code: 'INVALID_DATE' },
    });
  }
};

const createBookingData = (input: CreateBookingInput) => {
  const now = new Date();
  const mongoliaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  return {
    ...input,
    createdAt: mongoliaTime,
    updatedAt: mongoliaTime,
  };
};

const validateInput = (input: CreateBookingInput): void => {
  const { checkInDate, checkOutDate } = input;
  validateDateRange(checkInDate, checkOutDate);
  validateCheckInDate(checkInDate);
};

const createBookingInDB = async (input: CreateBookingInput): Promise<any> => {
  const bookingData = createBookingData(input);
  const createdBookingData = await BookingModel.create(bookingData);
  return createdBookingData;
};

export const createBooking = async (_: unknown, { input }: { input: CreateBookingInput }, __: unknown, ___: unknown): Promise<Booking> => {
  try {
    validateInput(input);
    const booking = await createBookingInDB(input);
    return booking as Booking;
  } catch (error) {
    throw new Error(`Data base Error ${error}`);
  }
};
