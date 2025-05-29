import { GraphQLError } from 'graphql';
import { Booking } from 'src/models/booking';
import { CreateBooking } from 'src/resolvers/mutations/booking/create-booking';

jest.mock('src/models/booking');

describe('CreateBooking Mutation', () => {
  const mockInput = {
    totalPrice: 200,
    bookStatus: 'PENDING',
    startDate: '2025-06-02T00:00:00.000+00:00',
    endDate: '2025-06-10T00:00:00.000+00:00',
    user: '683542c288acac72d9b902ce',
    room: '68369eaa0182030f83ae1f96',
  };

  const mockSavedBooking = {
    ...mockInput,
    _id: 'mock-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    (Booking.prototype.save as jest.Mock).mockResolvedValue(mockSavedBooking);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a booking successfully', async () => {
    const result = await CreateBooking(null, { input: mockInput });

    expect(Booking.prototype.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedBooking);
  });

  it('should handle error when booking creation fails', async () => {
    (Booking.prototype.save as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(CreateBooking(null, { input: mockInput })).rejects.toThrowError(
      new GraphQLError('Failed to create booking: Unknown error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          originalError: expect.any(Error),
          timestamp: expect.any(String),
          inputData: mockInput,
        },
      })
    );
  });
});
