import { Booking } from '../../../../src/models/booking';
import { getAllBookings } from 'src/resolvers/queries/booking/get-all-booking';

jest.mock('../../../../src/models/booking', () => ({
  Booking: {
    find: jest.fn(),
  },
}));

describe('getAllBookings query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all bookings successfully', async () => {
    const mockBookings = [
      {
        _id: 'booking-1',
        user: 'user1',
        room: 'room1',
        startDate: '2025-06-10T14:00:00Z',
        endDate: '2025-06-15T11:00:00Z',
        totalPrice: 500,
        bookStatus: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'booking-2',
        user: 'user2',
        room: 'room2',
        startDate: '2025-07-01T14:00:00Z',
        endDate: '2025-07-05T11:00:00Z',
        totalPrice: 800,
        bookStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const execMock = jest.fn().mockResolvedValue(mockBookings);
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Booking.find as jest.Mock).mockImplementation(findMock);

    const result = await getAllBookings();

    expect(Booking.find).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockBookings);
  });

  it('should throw an error if fetching bookings fails with Error instance', async () => {
    const errorMessage = 'Database error';

    const execMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Booking.find as jest.Mock).mockImplementation(findMock);

    await expect(getAllBookings())
      .rejects
      .toThrow(`Failed to fetch bookings: ${errorMessage}`);
  });

  it('should throw an error if fetching bookings fails with non-Error', async () => {
    const execMock = jest.fn().mockRejectedValue('Some string error');
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Booking.find as jest.Mock).mockImplementation(findMock);

    await expect(getAllBookings())
      .rejects
      .toThrow('Failed to fetch bookings: Unknown error');
  });

  it('should return empty array when no bookings exist', async () => {
    const execMock = jest.fn().mockResolvedValue([]);
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Booking.find as jest.Mock).mockImplementation(findMock);

    const result = await getAllBookings();

    expect(Booking.find).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
