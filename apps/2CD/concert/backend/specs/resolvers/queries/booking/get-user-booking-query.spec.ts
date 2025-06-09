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

jest.mock('src/utils/create-booking.ts/validate-user', () => ({
  validateUser: jest.fn(),
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
    await expect(
      getUserBooking!({}, { input: { userId: '', page: 0 } }, {}, mockInfo)
    ).rejects.toThrow('User ID is required');
  });

  it('should return bookings for a valid userId', async () => {
    (bookingsModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBookings),
      }),
    });

    const result = await getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo);

    expect(bookingsModel.find).toHaveBeenCalledWith({ user: 'user1' });
    expect(result).toEqual(mockBookings);
  });

  it('should throw an error if bookingsModel.find throws', async () => {
    (bookingsModel.find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(
      getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo)
    ).rejects.toThrow('Failed to get booking: DB error');
  });

  it('should throw an error if populate fails', async () => {
    (bookingsModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Populate failed')),
      }),
    });

    await expect(
      getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo)
    ).rejects.toThrow('Failed to get booking: Populate failed');
  });

  it('should throw "Unknown error" if non-Error is thrown in populate chain', async () => {
    (bookingsModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue('some random error string'),
      }),
    });

    await expect(
      getUserBooking!({}, { input: { userId: 'user1', page: 0 } }, {}, mockInfo)
    ).rejects.toThrow('Failed to get booking: Unknown error');
  });
});
