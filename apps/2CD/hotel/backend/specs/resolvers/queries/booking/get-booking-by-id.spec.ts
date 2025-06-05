import { Booking } from '../../../../src/models/booking';
import { getBookingById } from '../../../../src/resolvers/queries/booking/get-booking-by-id';

jest.mock('../../../../src/models/booking', () => ({
  Booking: {
    findById: jest.fn(),
  },
}));

describe('getBookingById query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return booking by id successfully', async () => {
    const mockBooking = {
      _id: 'booking-1',
      user: 'user1',
      room: 'room1',
      startDate: '2025-06-10T14:00:00Z',
      endDate: '2025-06-15T11:00:00Z',
      totalPrice: 500,
      bookStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const execMock = jest.fn().mockResolvedValue(mockBooking);
    (Booking.findById as jest.Mock).mockReturnValue({ exec: execMock });

    const result = await getBookingById(null, { id: 'booking-1' });

    expect(Booking.findById).toHaveBeenCalledWith('booking-1');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockBooking);
  });

  it('should throw an error if booking is not found', async () => {
    const execMock = jest.fn().mockResolvedValue(null);
    (Booking.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getBookingById(null, { id: 'non-existent-id' })).rejects.toThrow('Failed to fetch booking: Booking with id non-existent-id not found');
  });

  it('should throw an error if fetching booking fails with Error instance', async () => {
    const errorMessage = 'Database error';
    const execMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    (Booking.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getBookingById(null, { id: 'booking-1' })).rejects.toThrow(`Failed to fetch booking: ${errorMessage}`);
  });

  it('should throw an error if fetching booking fails with non-Error', async () => {
    const execMock = jest.fn().mockRejectedValue('Something bad happened');
    (Booking.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getBookingById(null, { id: 'booking-1' })).rejects.toThrow('Failed to fetch booking: Unknown error');
  });
});
