export const mapBookingStatusToGraphQL = (status: string): string => {
  const mapping: Record<string, string> = {
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    Booked: 'Booked',
  };
  return mapping[status];
};

export const mapGraphQLToMongooseBookingStatus = (status: string): string => {
  const mapping: Record<string, string> = {
    Booked: 'Booked',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
  };
  return mapping[status] || status;
};
