import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useGetBookingsByUserIdQuery, useHotelNameQuery, useGetRoomForBookingQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { PreviousBooking } from '@/components/BookingHistory/_components/PreviousBooking';
jest.mock('@/generated', () => ({
  useGetBookingsByUserIdQuery: jest.fn(),
  useHotelNameQuery: jest.fn(),
  useGetRoomForBookingQuery: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock('@/components/BookingHistory/_components/assets/EmptySvg', () => ({
  EmptySvg: jest.fn(() => <div data-testid="EmptySvg" />),
}));
const mockUseGetBookingsByUserIdQuery = useGetBookingsByUserIdQuery as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseHotelNameQuery = useHotelNameQuery as jest.Mock;
const mockUseGetRoomForBookingQuery = useGetRoomForBookingQuery as jest.Mock;
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
  it('Renders PreviousBookingCard for cancelled/completed bookings', () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: {
        getBookingsByUserId: [
          {
            id: '1',
            hotelId: 'XX',
            roomId: 'XX',
            checkInDate: '2025-09-05',
            adults: 2,
            status: 'Cancelled',
          },
          {
            id: '1',
            hotelId: 'XX',
            roomId: 'XX',
            checkInDate: '2025-09-05',
            adults: 2,
            status: 'Completed',
          },
        ],
      },
      loading: false,
    });
    mockUseHotelNameQuery.mockReturnValue({
      data: {
        hotel: {
          id: 'h1',
          name: 'Hotel A',
        },
      },
      loading: false,
    });
    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: {
        getRoom: {
          id: 'r1',
          name: 'Room A',
          __typename: 'Room',
          imageURL: ['/Images/NoImage.png'],
        },
      },
      loading: false,
    });

    render(<PreviousBooking />);

    expect(screen.getByText('Previous Booking')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByText('Booked')).not.toBeInTheDocument();
  });

  it('renders fallback when booking has empty status', () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: {
        getBookingsByUserId: [
          {
            id: '1',
            hotelId: 'h1',
            roomId: 'r1',
            checkInDate: '2025-09-05',
            adults: 2,
            status: '',
          },
        ],
      },
      loading: false,
    });

    render(<PreviousBooking />);

    expect(screen.getByText('Previous Booking')).toBeInTheDocument();
    expect(screen.getByText('No previous booking')).toBeInTheDocument();
    expect(screen.getByText('Your past stays will appear here once completed.')).toBeInTheDocument();
  });

  it('Should heck hoteldata on Previous booking card component', async () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: {
        getBookingsByUserId: [
          {
            id: '1',
            hotelId: 'XX',
            roomId: 'XX',
            checkInDate: '2025-09-05',
            adults: 2,
            status: 'Cancelled',
          },
        ],
      },
      loading: false,
    });

    mockUseHotelNameQuery.mockReturnValue({
      data: {
        hotel: {
          id: 'h1',
          name: 'Hotel A',
        },
      },
      loading: false,
    });

    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: {
        getRoom: {
          id: 'r1',
          name: 'Room A',
          __typename: 'Room',
          imageURL: ['/Images/NoImage.png'],
        },
      },
      loading: false,
    });

    render(<PreviousBooking />);

    expect(screen.getByText('Hotel A')).toBeInTheDocument();
    expect(screen.getByTestId('room-name')).toHaveTextContent('Room A');
    expect(screen.getByTestId('Image-Id')).toBeInTheDocument();
  });
});
