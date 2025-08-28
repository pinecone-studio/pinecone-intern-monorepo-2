const transformDate = (date: unknown): string | unknown => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

const transformDates = (obj: Record<string, unknown>): Record<string, unknown> => {
  const transformed = { ...obj };
  
  // Transform known date fields
  const dateFields = ['createdAt', 'updatedAt', 'checkInDate', 'checkOutDate'];
  dateFields.forEach(field => {
    if (transformed[field] instanceof Date) {
      transformed[field] = transformDate(transformed[field]);
    }
  });

  return transformed;
};

export const transformBooking = (booking: unknown): unknown => {
  if (!booking || typeof booking !== 'object') {
    return booking;
  }

  // Don't validate here - let the field resolvers handle it
  // Just transform dates and return the object as-is
  return transformDates(booking as Record<string, unknown>);
};

export const transformBookings = (bookings: unknown[]): unknown[] => {
  return bookings.map(transformBooking);
};

