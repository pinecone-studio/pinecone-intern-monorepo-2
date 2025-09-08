/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingsCard from '@/components/admin/get-room-booking/BookingsCard';
import { useGetBookingsByHotelIdQuery } from '@/generated';

// Mock the generated hook
jest.mock('@/generated', () => ({
  useGetBookingsByHotelIdQuery: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

const mockUseGetBookingsByHotelIdQuery = useGetBookingsByHotelIdQuery as jest.MockedFunction<typeof useGetBookingsByHotelIdQuery>;

describe('BookingsCard', () => {
  const mockHotelId = 'hotel-123';
  const mockBookings = [
    {
      id: 'booking-1',
      status: 'Booked',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-18',
      adults: 2,
      children: 1,
    },
    {
      id: 'booking-2',
      status: 'Cancelled',
      checkInDate: '2024-01-20',
      checkOutDate: '2024-01-22',
      adults: 1,
      children: 0,
    },
    {
      id: 'booking-3',
      status: 'Completed',
      checkInDate: '2024-01-10',
      checkOutDate: '2024-01-12',
      adults: 3,
      children: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Bookings')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load bookings';
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText(`Error loading bookings: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders empty state when no bookings', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: [] },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('No bookings found')).toBeInTheDocument();
  });

  it('renders bookings list with correct data', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText(/ooking-1/)).toBeInTheDocument();
    expect(screen.getByText(/ooking-2/)).toBeInTheDocument();
    expect(screen.getByText(/ooking-3/)).toBeInTheDocument();
  });

  it('displays correct status badges', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getAllByText('Booked')).toHaveLength(2); // One in badge, one in summary
    expect(screen.getAllByText('Cancelled')).toHaveLength(2); // One in badge, one in summary
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays booking details correctly', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    // Check date formatting
    expect(screen.getByText('Jan 15, 2024 - Jan 18, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 20, 2024 - Jan 22, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 10, 2024 - Jan 12, 2024')).toBeInTheDocument();

    // Check guest counts
    expect(screen.getByText('2 Adults, 1 Children')).toBeInTheDocument();
    expect(screen.getByText('1 Adults')).toBeInTheDocument();
    expect(screen.getByText('3 Adults, 2 Children')).toBeInTheDocument();
  });

  it('displays summary statistics correctly', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('3')).toBeInTheDocument(); // Total bookings
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // Booked and Cancelled counts
    expect(screen.getAllByText('Booked')).toHaveLength(2); // One in badge, one in summary
    expect(screen.getAllByText('Cancelled')).toHaveLength(2); // One in badge, one in summary
  });

  it('handles booking click navigation', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    const bookingRow = screen.getByText(/ooking-1/).closest('div');
    fireEvent.click(bookingRow!);

    expect(mockPush).toHaveBeenCalledWith('/admin/guests/booking-1');
  });

  it('handles unknown status correctly', () => {
    const bookingsWithUnknownStatus = [
      {
        id: 'booking-unknown',
        status: 'UNKNOWN_STATUS',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        adults: 2,
        children: 0,
      },
    ];

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: bookingsWithUnknownStatus },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('UNKNOWN_STATUS')).toBeInTheDocument();
  });

  it('handles null status correctly', () => {
    const bookingsWithNullStatus = [
      {
        id: 'booking-null',
        status: null,
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        adults: 2,
        children: 0,
      },
    ];

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: bookingsWithNullStatus },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('handles invalid date formatting gracefully', () => {
    const bookingsWithInvalidDate = [
      {
        id: 'booking-invalid-date',
        status: 'Booked',
        checkInDate: 'invalid-date',
        checkOutDate: 'invalid-date',
        adults: 2,
        children: 0,
      },
    ];

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: bookingsWithInvalidDate },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('invalid-date - invalid-date')).toBeInTheDocument();
  });

  it('limits displayed bookings to 5', () => {
    const manyBookings = Array.from({ length: 10 }, (_, i) => ({
      id: `booking-${i + 1}`,
      status: 'Booked',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-18',
      adults: 2,
      children: 0,
    }));

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: manyBookings },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    // Should only show first 5 bookings
    expect(screen.getByText(/ooking-1/)).toBeInTheDocument();
    expect(screen.getByText(/ooking-5/)).toBeInTheDocument();
    expect(screen.queryByText(/ooking-6/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ooking-10/)).not.toBeInTheDocument();

    // But total count should show all 10
    expect(screen.getAllByText('10')).toHaveLength(2); // Total and Booked counts
  });

  it('handles undefined bookings data', () => {
    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('No bookings found')).toBeInTheDocument();
  });

  it('handles bookings with zero children', () => {
    const bookingsWithZeroChildren = [
      {
        id: 'booking-1',
        status: 'Booked',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        adults: 2,
        children: 0,
      },
    ];

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: bookingsWithZeroChildren },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText('2 Adults')).toBeInTheDocument();
    // Should not show children when count is 0
    expect(screen.queryByText(/Children/)).not.toBeInTheDocument();
  });

  it('handles bookings with zero adults', () => {
    const bookingsWithZeroAdults = [
      {
        id: 'booking-1',
        status: 'Booked',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        adults: 0,
        children: 1,
      },
    ];

    mockUseGetBookingsByHotelIdQuery.mockReturnValue({
      data: { getBookingsByHotelId: bookingsWithZeroAdults },
      loading: false,
      error: undefined,
    } as any);

    render(<BookingsCard hotelId={mockHotelId} />);

    expect(screen.getByText(/0 Adults/)).toBeInTheDocument();
    expect(screen.getByText(/1 Children/)).toBeInTheDocument();
  });
});
