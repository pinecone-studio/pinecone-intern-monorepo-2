import { BookingModel } from '../models/booking.model';
import { Booking } from '../generated';
import { transformBookings } from './transform-booking';
import { convertMongooseArrayToPlain } from './convert-mongoose';
import { PlainBooking } from '../types/booking.types';
import { 
  isTestEnvironment, 
  checkConnectionStatus, 
  logSampleBookingData, 
  handleConnectionError 
} from './booking-helpers';

// Helper function to execute database query based on environment
const executeBookingQuery = async () => {
  if (isTestEnvironment()) {
    return await BookingModel.find({})
      .sort({ createdAt: -1 })
      .exec();
  }
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Database query timed out after 15 seconds'));
    }, 15000);
  });
  
  const queryPromise = BookingModel.find({})
    .sort({ createdAt: -1 })
    .exec();
  
  return await Promise.race([queryPromise, timeoutPromise]);
};

const isTimeoutError = (error: unknown): boolean => {
  return error instanceof Error && error.message.includes('timed out');
};

const checkConnectionAfterError = async (): Promise<void> => {
  if (!isTestEnvironment()) {
    const connectionStillGood = await checkConnectionStatus();
    if (!connectionStillGood) {
      console.error('❌ Database connection lost during query');
      handleConnectionError();
    }
  }
};

// Helper function to handle query errors
const handleQueryError = async (queryError: unknown): Promise<never> => {
  console.error('❌ Database query error:', queryError);
  
  if (isTimeoutError(queryError)) {
    throw queryError;
  }
  
  await checkConnectionAfterError();
  throw queryError;
};

const validateConnection = async (): Promise<void> => {
  const isConnected = await checkConnectionStatus();
  if (!isConnected) {
    console.error('❌ Database connection check failed');
    handleConnectionError();
  }
};

const logConnectionInfo = async (): Promise<void> => {
  console.log('🔍 Executing database query...');
  
  if (!isTestEnvironment()) {
    console.log('📊 Connection state:', (await import('mongoose')).connection.readyState);
  }
};

const processBookingsData = (bookings: any[]): Booking[] => {
  if (!bookings || bookings.length === 0) {
    console.log('No bookings found in database');
    return [];
  }
  
  console.log(`Found ${bookings.length} bookings, transforming data...`);
  
  const plainBookings = convertMongooseArrayToPlain(bookings) as PlainBooking[];
  logSampleBookingData(plainBookings);
  
  return transformBookings(plainBookings);
};

// Helper function to fetch and process bookings with timeout
export const fetchAndProcessBookings = async (): Promise<Booking[]> => {
  await validateConnection();
  await logConnectionInfo();
  
  try {
    const bookings = await executeBookingQuery();
    return processBookingsData(bookings);
  } catch (queryError) {
    return await handleQueryError(queryError);
  }
};
