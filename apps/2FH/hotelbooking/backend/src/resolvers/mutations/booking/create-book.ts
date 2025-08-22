import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../models/booking.model';
import { CreateBookingInput, Booking, BookingStatus } from '../../../generated';
import { mapGraphQLToMongooseBookingStatus } from '../../common/booking-status.mapper';
import { transformBooking } from '../../../utils/transform-booking';

const validateDateRange = (checkInDate: string, checkOutDate: string): void => {
  if (new Date(checkOutDate) <= new Date(checkInDate)) {
    throw new GraphQLError('Check-out date must be after check-in date', {
      extensions: { code: 'INVALID_DATE_RANGE' }
    });
  }
};

const validateGuestCount = (adults: number, children: number): void => {
  if (adults < 1) {
    throw new GraphQLError('At least one adult is required', {
      extensions: { code: 'INVALID_GUEST_COUNT' }
    });
  }

  if (children < 0) {
    throw new GraphQLError('Children count cannot be negative', {
      extensions: { code: 'INVALID_GUEST_COUNT' }
    });
  }
};

const validateCheckInDate = (checkInDate: string): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(checkInDate) < today) {
    throw new GraphQLError('Check-in date cannot be in the past', {
      extensions: { code: 'INVALID_DATE' }
    });
  }
};

const createBookingData = (input: CreateBookingInput) => ({
  ...input,
  status: mapGraphQLToMongooseBookingStatus(BookingStatus.Booked),
  createdAt: new Date(),
  updatedAt: new Date()
});

const validateInput = (input: CreateBookingInput): void => {
  const { checkInDate, checkOutDate, adults, children } = input;
  validateDateRange(checkInDate, checkOutDate);
  validateGuestCount(adults, children);
  validateCheckInDate(checkInDate);
};

const extractDocumentFromResult = (createdBooking: any) => {
  if (Array.isArray(createdBooking)) {
    return createdBooking[0]; // Take first item if array
  }
  return createdBooking; // Single document
};

const createFallbackObject = (document: any) => ({
  _id: document._id || document.id,
  userId: document.userId,
  hotelId: document.hotelId,
  roomId: document.roomId,
  checkInDate: document.checkInDate,
  checkOutDate: document.checkOutDate,
  adults: document.adults,
  children: document.children,
  status: document.status,
  createdAt: document.createdAt || new Date(),
  updatedAt: document.updatedAt || new Date()
});

const convertDocumentToPlainObject = (document: any) => {
  if (document && typeof document.toObject === 'function') {
    return document.toObject();
  }
  
  return createFallbackObject(document);
};

const createBookingInDB = async (input: CreateBookingInput): Promise<Booking> => {
  const bookingData = createBookingData(input);
  const createdBooking = await BookingModel.create(bookingData);
  
  const document = extractDocumentFromResult(createdBooking);
  const plainBooking = convertDocumentToPlainObject(document);
  
  return transformBooking(plainBooking);
};

const handleValidationError = (error: Error): never => {
  throw new GraphQLError(`Validation failed: ${error.message}`, {
    extensions: { code: 'VALIDATION_ERROR' }
  });
};

const handleGenericError = (error: unknown): never => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  throw new GraphQLError(`Failed to create booking: ${errorMessage}`, {
    extensions: { 
      code: 'BOOKING_CREATION_FAILED', 
      originalError: errorMessage
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

export const createBooking = async (
  _: unknown,
  { input }: { input: CreateBookingInput },
  __: unknown,
  ___: unknown
): Promise<Booking> => {
  try {
    validateInput(input);
    const createdBooking = await createBookingInDB(input);
    return createdBooking;
  } catch (error) {
    return handleErrors(error);
  }
};