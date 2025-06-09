/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getUserBooking } from 'src/resolvers/queries/booking/get-user-booking';
import { bookingsModel } from 'src/models';
import { GraphQLResolveInfo } from 'graphql';
import { BookingStatus } from 'src/generated';

jest.mock('src/models', () => ({
  bookingsModel: {
    find: jest.fn(),
  },
}));

const mockInfo = {} as GraphQLResolveInfo;

const mockBookings = [
  {
    _id: 'booking1',
    user: { id: 'user1', name: 'John Doe' },
    concert: { id: 'concert1', title: 'Summer Fest' },
    tickets: [],
    status: BookingStatus.Completed,
    totalAmount: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('getUserBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if userId is missing', async () => {
    await expect(getUserBooking!({}, { input: { userId: '', page: 0 } }, {}, mockInfo)).rejects.toThrow('User ID is required');
  });

  it('should return bookings for a valid userId', async () => {
    (bookingsModel.find as jest.Mock).mockReturnValue({
      populate: () => ({
        populate: () => mockBookings,
      }),
    });

    const result = await getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo);

    expect(bookingsModel.find).toHaveBeenCalledWith({ user: 'user1' });
    expect(result).toEqual(mockBookings);
  });

  it('should throw a fetch error if DB fails', async () => {
    (bookingsModel.find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo)).rejects.toThrow('Failed to fetch user bookings');
  });
});
