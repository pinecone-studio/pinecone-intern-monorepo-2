import { BookingModel } from '../models/booking.model';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  invalidRecords: Array<{
    id: string;
    field: string;
    value: unknown;
  }>;
}

// Helper function to add validation error
const addValidationError = (
  result: ValidationResult, 
  bookingObj: Record<string, unknown>, 
  field: string, 
  message: string
): void => {
  result.isValid = false;
  result.errors.push(`Booking ${bookingObj._id || bookingObj.id}: ${message}`);
  result.invalidRecords.push({
    id: (bookingObj._id || bookingObj.id) as string,
    field,
    value: bookingObj[field]
  });
};

// Helper function to check required fields
const checkRequiredFields = (bookingObj: Record<string, unknown>, result: ValidationResult): void => {
  const requiredFields = ['adults', 'children', 'status'];
  requiredFields.forEach(field => {
    if (bookingObj[field] === null || bookingObj[field] === undefined) {
      addValidationError(result, bookingObj, field, `Missing required field '${field}'`);
    }
  });
};

// Helper function to check field types
const checkFieldTypes = (bookingObj: Record<string, unknown>, result: ValidationResult): void => {
  if (typeof bookingObj.adults !== 'number') {
    addValidationError(
      result, 
      bookingObj, 
      'adults', 
      `Field 'adults' should be a number, got ${typeof bookingObj.adults}`
    );
  }
  
  if (typeof bookingObj.children !== 'number') {
    addValidationError(
      result, 
      bookingObj, 
      'children', 
      `Field 'children' should be a number, got ${typeof bookingObj.children}`
    );
  }
};

export const validateBookingData = async (): Promise<ValidationResult> => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    invalidRecords: []
  };

  try {
    const bookings = await BookingModel.find({});
    
    bookings.forEach((booking) => {
      const bookingObj = (booking as { toObject(): Record<string, unknown> }).toObject();
      
      // Check required fields
      checkRequiredFields(bookingObj, result);
      
      // Check field types
      checkFieldTypes(bookingObj, result);
    });
    
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to validate booking data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
};

export const logValidationResults = (result: ValidationResult): void => {
  if (result.isValid) {
    console.log('✅ All booking records are valid');
    return;
  }
  
  console.error('❌ Booking data validation failed:');
  result.errors.forEach(error => console.error(`  - ${error}`));
  
  if (result.invalidRecords.length > 0) {
    console.error('\n📋 Invalid records summary:');
    result.invalidRecords.forEach(record => {
      console.error(`  - ID: ${record.id}, Field: ${record.field}, Value: ${record.value}`);
    });
  }
};

