import { getAllBookings } from 'src/resolvers/queries/booking/get-all-booking';
import { Booking } from 'src/models/booking';
import { GraphQLError } from 'graphql';

jest.mock('src/models/booking', () => ({
  Booking: {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn(),
  },
}));

describe('getAllBookings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all bookings with populated room', async () => {
    const mockBookings = [
      { _id: '1', user: 'User A', room: { name: 'Room A' } },
      { _id: '2', user: 'User B', room: { name: 'Room B' } },
    ];

    (Booking.find as jest.Mock).mockReturnThis();
    (Booking.populate as jest.Mock).mockResolvedValue(mockBookings);

    const result = await getAllBookings();

    expect(Booking.find).toHaveBeenCalled();
    expect(Booking.populate).toHaveBeenCalledWith('room');
    expect(result).toEqual(mockBookings);
  });

  it('should throw GraphQLError when Booking.find fails', async () => {
    const errorMessage = 'Simulated DB error';
    (Booking.find as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(getAllBookings()).rejects.toThrow(GraphQLError);
    await expect(getAllBookings()).rejects.toThrow(`Failed to fetch bookings: ${errorMessage}`);
  });
});
