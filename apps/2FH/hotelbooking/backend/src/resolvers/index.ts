import { mapBookingStatusToGraphQL } from './common/booking-status.mapper';
import * as Mutation from './mutations';

import * as Query from './queries';
 

// Interface for the parent object in field resolvers
interface BookingParent {
  id?: string;
  _id?: string;
  userId?: string;
  user_id?: string;
  hotelId?: string;
  hotel_id?: string;
  roomId?: string;
  room_id?: string;
  checkInDate?: string;
  check_in_date?: string;
  checkOutDate?: string;
  check_out_date?: string;
  adults?: number;
  children?: number;
  status?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Helper function to validate parent object
const validateParent = (parent: BookingParent, fieldName: string): void => {
  if (!parent) {
    throw new Error(`Cannot return null for non-nullable field Booking.${fieldName}. Parent object is missing.`);
  }
};

// Helper function to get primary field value
const getPrimaryFieldValue = (parent: BookingParent, fieldName: string): unknown => {
  return parent[fieldName];
};

// Helper function to get fallback field value
const getFallbackFieldValue = (parent: BookingParent, fallbackField: string): unknown => {
  return parent[fallbackField];
};

// Helper function to validate field value
const validateFieldValue = (value: unknown, fieldName: string): unknown => {
  if (value === null || value === undefined) {
    throw new Error(`Cannot return null for non-nullable field Booking.${fieldName}.`);
  }
  return value;
};

// Helper function to get field value
const getFieldValue = (parent: BookingParent, fieldName: string, fallbackField?: string): unknown => {
  let value = getPrimaryFieldValue(parent, fieldName);
  
  if (fallbackField && (value === null || value === undefined)) {
    value = getFallbackFieldValue(parent, fallbackField);
  }
  
  return validateFieldValue(value, fieldName);
};

// Helper function to log parent object details
const logParentObjectDetails = (parent: BookingParent): void => {
  console.error('ID field resolver - parent object:', {
    hasId: !!parent.id,
    hasUnderscoreId: !!parent._id,
    parentKeys: Object.keys(parent),
    parentType: typeof parent,
    parentValue: parent
  });
};

// Helper function to resolve ID field
const resolveIdField = (parent: BookingParent): string => {
  const value = parent.id || parent._id;
  if (value === null || value === undefined) {
    logParentObjectDetails(parent);
    throw new Error('Cannot return null for non-nullable field Booking.id.');
  }
  return value as string;
};

// Helper function to reduce complexity in field resolvers
const createFieldResolver = (fieldName: string, fallbackField?: string) => {
  return (parent: BookingParent) => {
    validateParent(parent, fieldName);
    return getFieldValue(parent, fieldName, fallbackField);
  };
};

export const resolvers = {

    Mutation,
  
    Query,
  
  Booking: {
    // Field resolvers to handle database field mapping and null values
    id: (parent: BookingParent) => {
      if (!parent) {
        console.error('ID field resolver - parent is null/undefined');
        throw new Error('Cannot return null for non-nullable field Booking.id. Parent object is missing.');
      }
      
      return resolveIdField(parent);
    },
    userId: createFieldResolver('userId', 'user_id'),
    hotelId: createFieldResolver('hotelId', 'hotel_id'),
    roomId: createFieldResolver('roomId', 'room_id'),
    checkInDate: createFieldResolver('checkInDate', 'check_in_date'),
    checkOutDate: createFieldResolver('checkOutDate', 'check_out_date'),
    adults: createFieldResolver('adults'),
    children: createFieldResolver('children'),
    status: (parent: BookingParent) => {
      const statusValue = getFieldValue(parent, 'status');
      return mapBookingStatusToGraphQL(statusValue as string);
    },
    createdAt: (parent: BookingParent) => parent?.createdAt || parent?.created_at,
    updatedAt: (parent: BookingParent) => parent?.updatedAt || parent?.updated_at,
  },
};
