export const mapBookingStatusToGraphQL = (status: string): string => {
  const mapping: Record<string, string> = {
    'booked': 'BOOKED',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
  };
  return mapping[status] || 'BOOKED';
};

export const mapGraphQLToMongooseBookingStatus = (status: string): string => {
  const mapping: Record<string, string> = {
    BOOKED: 'booked',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  };
  return mapping[status] || status;
};
