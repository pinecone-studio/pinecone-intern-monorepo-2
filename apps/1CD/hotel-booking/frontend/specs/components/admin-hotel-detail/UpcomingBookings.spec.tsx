import UpcomingBookings from '@/components/admin-hotel-detail/UpcomingBookings';
import { BookingsType } from '@/generated';
import { render } from '@testing-library/react';

describe('admin hotel detail room type test', () => {
  const bookings: BookingsType[] = [
    {
      totalPrice: 10000,
      _id: '1',
      firstName: 'test',
      checkInDate: '2024-12-19',
      checkOutDate: '2024-12-31',
    },
  ];
  it('1. it should render', () => {
    render(<UpcomingBookings bookings={bookings} />);
  });
});
