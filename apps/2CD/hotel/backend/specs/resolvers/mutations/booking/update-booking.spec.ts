import { GraphQLError } from 'graphql';
import { Booking } from 'src/models/booking';
import { updateBooking } from 'src/resolvers/mutations/booking/update-booking';

jest.mock('src/models/booking');

describe('updateBooking Mutation', () => {
  const mockInput = { totalPrice: 200, bookStatus: 'confirmed' };
  const mockBooking = { ...mockInput, _id: 'mock-id' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return the booking', async () => {
    (Booking.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockBooking);
    const result = await updateBooking(null, { input: mockInput, id: 'mock-id' });
    expect(result).toEqual(mockBooking);
  });

  it('should throw error if booking not found', async () => {
    (Booking.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(updateBooking(null, { input: mockInput, id: 'mock-id' })).rejects.toThrowError(
      new GraphQLError('Booking not found', {
        extensions: {
          code: 'NOT_FOUND',
          inputData: mockInput,
        },
      })
    );
  });

  it('should handle internal server error', async () => {
    const errorMessage = 'Database error';
    (Booking.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await expect(updateBooking(null, { input: mockInput, id: 'mock-id' })).rejects.toThrowError(
      new GraphQLError(`Failed to update booking: ${errorMessage}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          inputData: mockInput,
          originalError: expect.any(Error),
        },
      })
    );
  });
});
