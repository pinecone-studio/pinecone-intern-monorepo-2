import { Booking } from 'src/models/booking';
import { Hotel } from 'src/models/hotel';
import { mostBookedHotel } from 'src/resolvers/queries/booking/most-booked-hotel';

jest.mock('src/models/booking');
jest.mock('src/models/hotel');

describe('mostBookedHotel resolver', () => {
  it('returns hotels sorted by booking count', async () => {
    (Booking.aggregate as jest.Mock).mockResolvedValue([
      { _id: 'hotel1', bookingCount: 15 },
      { _id: 'hotel2', bookingCount: 8 },
    ]);

    (Hotel.findById as jest.Mock).mockImplementation((id) => Promise.resolve({ id, name: `Hotel ${id}` }));

    const result = await mostBookedHotel(undefined);

    expect(Booking.aggregate).toHaveBeenCalledWith([{ $group: { _id: '$hotel', bookingCount: { $sum: 1 } } }, { $sort: { bookingCount: -1 } }, { $limit: 10 }]);

    expect(Hotel.findById).toHaveBeenCalledTimes(2);

    expect(result).toEqual([
      { hotel: { id: 'hotel1', name: 'Hotel hotel1' }, bookingCount: 15 },
      { hotel: { id: 'hotel2', name: 'Hotel hotel2' }, bookingCount: 8 },
    ]);
  });

  it('returns empty array when no bookings', async () => {
    (Booking.aggregate as jest.Mock).mockResolvedValue([]);
    const result = await mostBookedHotel(undefined);
    expect(result).toEqual([]);
  });
});
