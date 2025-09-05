import { render, screen } from '@testing-library/react';
import { useGetBookingsByUserIdQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { PreviousBooking } from '@/components/BookingHistory/_components/PreviousBooking';

// GraphQL query-ийг mock хийх
jest.mock('@/generated', () => ({
  useGetBookingsByUserIdQuery: jest.fn(),
}));

// next/navigation useParams mock
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// EmptySvg mock
jest.mock('./assets/EmptySvg', () => ({
  EmptySvg: jest.fn(() => <div data-testid="EmptySvg" />),
}));

const mockUseGetBookingsByUserIdQuery = useGetBookingsByUserIdQuery as jest.Mock;
const mockUseParams = useParams as jest.Mock;

describe('PreviousBooking Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ userid: '123' });
  });

  it('renders EmptySvg and message when no bookings exist', () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: { getBookingsByUserId: [] },
    });

    render(<PreviousBooking />);

    expect(screen.getByText('Previous Booking')).toBeInTheDocument();
    expect(screen.getByTestId('EmptySvg')).toBeInTheDocument();
    expect(screen.getByText('No previous booking')).toBeInTheDocument();
    expect(screen.getByText('Your past stays will appear here once completed.')).toBeInTheDocument();
  });

  it('renders PreviousBookingCard for cancelled/completed bookings', () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: {
        getBookingsByUserId: [
          { id: '1', hotelId: 'h1', roomId: 'r1', checkInDate: '2025-09-05', adults: 2, status: 'Cancelled' },
          { id: '2', hotelId: 'h2', roomId: 'r2', checkInDate: '2025-09-06', adults: 1, status: 'Completed' },
          { id: '3', hotelId: 'h3', roomId: 'r3', checkInDate: '2025-09-07', adults: 1, status: 'Booked' }, // ignored
        ],
      },
    });

    render(<PreviousBooking />);

    expect(screen.getByText('Previous Booking')).toBeInTheDocument();
    // Cancelled болон Completed booking-ууд render байгаа эсэх
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    // Booked статус нь render болохгүй
    expect(screen.queryByText('Booked')).not.toBeInTheDocument();
  });
});
