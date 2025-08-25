import { BookingStatus } from '../../generated';

/**
 * Maps GraphQL BookingStatus enum values to Mongoose model status values
 * @param graphqlStatus - The GraphQL BookingStatus enum value
 * @returns The corresponding Mongoose status string
 */
export const mapGraphQLToMongooseBookingStatus = (graphqlStatus: BookingStatus): string => {
  const statusMap: Record<BookingStatus, string> = {
    [BookingStatus.Booked]: 'booked',
    [BookingStatus.Completed]: 'completed',
    [BookingStatus.Cancelled]: 'cancelled'
  };
  
  return statusMap[graphqlStatus];
};

/**
 * Maps Mongoose model status values to GraphQL BookingStatus enum values
 * @param mongooseStatus - The Mongoose status string
 * @returns The corresponding GraphQL BookingStatus enum value
 */
export const mapMongooseToGraphQLBookingStatus = (mongooseStatus: string): BookingStatus => {
  // Handle null/undefined cases
  if (mongooseStatus == null) {
    throw new Error(`Invalid Mongoose status: ${mongooseStatus}`);
  }
  
  // Normalize the status to lowercase to handle both cases
  const normalizedStatus = mongooseStatus.toLowerCase();
  
  const statusMap: Record<string, BookingStatus> = {
    'booked': BookingStatus.Booked,
    'completed': BookingStatus.Completed,
    'cancelled': BookingStatus.Cancelled
  };
  
  const mappedStatus = statusMap[normalizedStatus];
  if (!mappedStatus) {
    throw new Error(`Invalid Mongoose status: ${mongooseStatus} (normalized: ${normalizedStatus})`);
  }
  
  return mappedStatus;
};

/**
 * Maps a string status to GraphQL BookingStatus enum (with fallback)
 * @param status - The status string
 * @returns The corresponding GraphQL BookingStatus enum value
 */
export const mapBookingStatusToGraphQL = (status: string): BookingStatus => {
  // Handle null/undefined cases
  if (status == null) {
    return BookingStatus.Booked; // Default fallback
  }
  
  // Normalize the status to lowercase to handle both cases
  const normalizedStatus = status.toLowerCase();
  
  const mapping: Record<string, BookingStatus> = {
    'booked': BookingStatus.Booked,
    'completed': BookingStatus.Completed,
    'cancelled': BookingStatus.Cancelled,
  };
  return mapping[normalizedStatus] || BookingStatus.Booked;
};
