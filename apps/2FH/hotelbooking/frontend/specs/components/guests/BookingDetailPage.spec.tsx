/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingDetailPage from '@/components/guests/BookingDetailPage';
import { useBookingDetailData } from '@/components/guests/useBookingDetailData';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/components/guests/useBookingDetailData', () => ({
  useBookingDetailData: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/guests/GuestInfoCard', () => ({
  __esModule: true,
  default: ({ guestInfo, booking, onStatusUpdate }: any) => (
    <div data-testid="guest-info-card">
      <div>
        Guest: {guestInfo.firstName} {guestInfo.lastName}
      </div>
      <div>Status: {booking.status}</div>
      <button onClick={onStatusUpdate}>Update Status</button>
    </div>
  ),
}));

jest.mock('@/components/guests/RoomDetailsCard', () => ({
  __esModule: true,
  default: ({ room, booking }: any) => (
    <div data-testid="room-details-card">
      <div>Room: {room?.name || 'Unknown Room'}</div>
      <div>Room ID: {booking.roomId}</div>
    </div>
  ),
}));

jest.mock('@/components/guests/PriceDetailCard', () => ({
  __esModule: true,
  default: ({ room }: any) => (
    <div data-testid="price-detail-card">
      <div>Price: {room?.pricePerNight || 0}₮</div>
    </div>
  ),
}));

const mockUseBookingDetailData = useBookingDetailData as jest.MockedFunction<typeof useBookingDetailData>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('BookingDetailPage', () => {
  const mockBooking = {
    id: 'booking-1',
    userId: 'user-1',
    roomId: 'room-1',
    hotelId: 'hotel-1',
    status: 'BOOKED',
    adults: 2,
    children: 1,
    checkInDate: '2024-02-01',
    checkOutDate: '2024-02-03',
  };

  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    pricePerNight: 150000,
  };

  const mockGuestInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+976 99112233',
    guestRequest: 'No Request',
    roomNumber: 'Room #001',
  };

  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  const defaultProps = {
    bookingId: 'booking-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('renders loading state', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: undefined,
      room: undefined,
      guestInfo: mockGuestInfo,
      loading: true,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Loading booking details...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: undefined,
      room: undefined,
      guestInfo: mockGuestInfo,
      loading: false,
      error: new Error('Failed to load booking'),
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Error loading booking details')).toBeInTheDocument();
  });

  it('renders error state when booking is null', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: null,
      room: undefined,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Error loading booking details')).toBeInTheDocument();
  });

  it('renders booking details when data is available', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Guest Info')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('guest-info-card')).toBeInTheDocument();
    expect(screen.getByTestId('room-details-card')).toBeInTheDocument();
    expect(screen.getByTestId('price-detail-card')).toBeInTheDocument();
  });

  it('displays breadcrumb navigation', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Guest Info')).toBeInTheDocument();
  });

  it('calls router.back when back button is clicked', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    const backButton = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('renders with correct page structure', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    const pageContainer = screen.getByTestId('guest-info-card').closest('.min-h-screen');
    expect(pageContainer).toHaveClass('bg-gray-50', 'p-6');
  });

  it('renders grid layout correctly', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    const onStatusUpdate = jest.fn();
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate,
    });

    render(<BookingDetailPage {...defaultProps} />);

    // Check that guest info is passed correctly
    expect(screen.getByText('Guest: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Status: BOOKED')).toBeInTheDocument();

    // Check that room details are passed correctly
    expect(screen.getByText('Room: Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByText('Room ID: room-1')).toBeInTheDocument();

    // Check that price details are passed correctly
    expect(screen.getByText('Price: 150000₮')).toBeInTheDocument();
  });

  it('handles status update', () => {
    const onStatusUpdate = jest.fn();
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate,
    });

    render(<BookingDetailPage {...defaultProps} />);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    expect(onStatusUpdate).toHaveBeenCalled();
  });

  it('handles missing room data', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: null,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Room: Unknown Room')).toBeInTheDocument();
    expect(screen.getByText('Price: 0₮')).toBeInTheDocument();
  });

  it('handles missing guest info', () => {
    const incompleteGuestInfo = {
      firstName: 'John',
      lastName: '',
      email: '',
      phone: '',
      guestRequest: '',
      roomNumber: '',
    };

    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: incompleteGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(screen.getByText('Guest: John')).toBeInTheDocument();
  });

  it('calls useBookingDetailData with correct booking ID', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    expect(mockUseBookingDetailData).toHaveBeenCalledWith('booking-1');
  });

  it('matches snapshot for loading state', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: undefined,
      room: undefined,
      guestInfo: mockGuestInfo,
      loading: true,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    const { container } = render(<BookingDetailPage {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for loaded state', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: mockBooking,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    const { container } = render(<BookingDetailPage {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for error state', () => {
    mockUseBookingDetailData.mockReturnValue({
      booking: undefined,
      room: undefined,
      guestInfo: mockGuestInfo,
      loading: false,
      error: new Error('Failed to load booking'),
      onStatusUpdate: jest.fn(),
    });

    const { container } = render(<BookingDetailPage {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('uses fallback status when booking status is undefined', () => {
    const bookingWithUndefinedStatus = {
      ...mockBooking,
      status: undefined,
    };

    mockUseBookingDetailData.mockReturnValue({
      booking: bookingWithUndefinedStatus,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    // The GuestInfoCard mock should receive the fallback status 'BOOKED'
    expect(screen.getByText('Status: BOOKED')).toBeInTheDocument();
  });

  it('uses fallback status when booking status is null', () => {
    const bookingWithNullStatus = {
      ...mockBooking,
      status: null,
    };

    mockUseBookingDetailData.mockReturnValue({
      booking: bookingWithNullStatus,
      room: mockRoom,
      guestInfo: mockGuestInfo,
      loading: false,
      error: undefined,
      onStatusUpdate: jest.fn(),
    });

    render(<BookingDetailPage {...defaultProps} />);

    // The GuestInfoCard mock should receive the fallback status 'BOOKED'
    expect(screen.getByText('Status: BOOKED')).toBeInTheDocument();
  });
});
