import BookingStatusBadge from '@/components/BookingStatusBadge';
import { BookingStatus } from '@/generated';
import { render } from '@testing-library/react';

describe("Booking status badge display component's test", () => {
  it('1. it should render with booked status', () => {
    render(<BookingStatusBadge status={BookingStatus.Booked} />);
  });
  it('2. it should render with completed status', () => {
    render(<BookingStatusBadge status={BookingStatus.Completed} />);
  });
  it('3. it should render with cancelled status', () => {
    render(<BookingStatusBadge status={BookingStatus.Cancelled} />);
  });
});
