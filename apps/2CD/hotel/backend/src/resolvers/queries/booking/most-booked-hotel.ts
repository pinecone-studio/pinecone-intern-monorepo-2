import { Booking } from 'src/models/booking';
import { Hotel } from 'src/models/hotel';

export const mostBookedHotel = async (_: unknown) => {
  const bookingStats = await Booking.aggregate([
    {
      $group: {
        _id: '$hotel',
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: { bookingCount: -1 },
    },
    {
      $limit: 10,
    },
  ]);
  const results = await Promise.all(
    bookingStats.map(async (entry) => {
      const hotel = await Hotel.findById(entry._id);
      return {
        hotel,
        bookingCount: entry.bookingCount,
      };
    })
  );

  return results;
};
