import { render, screen, fireEvent } from '@testing-library/react';
import { BookedCard } from '@/components/BookingHistory/_components/BookedCard';
import { useRouter } from 'next/navigation';

// mock-ууд
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const mockUseHotelNameQuery = jest.fn();
const mockUseGetRoomForBookingQuery = jest.fn();
jest.mock('@/generated', () => ({
  useHotelNameQuery: () => mockUseHotelNameQuery(),
  useGetRoomForBookingQuery: () => mockUseGetRoomForBookingQuery(),
}));
const mockBookType = 'Booked';
const mockBooking = {
  id: 'b1',
  hotelId: 'h1',
  roomId: 'r1',
  checkInDate: '2025-09-08',
  status: mockBookType,
  adults: 2,
  children: 1,
};
describe('BookedCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    mockUseHotelNameQuery.mockReturnValue({
      data: { hotel: { name: 'Hotel Test' } },
      loading: false,
    });

    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: { getRoom: { id: 'r1', name: 'Room A', __typename: 'Room', status: 'Booked', imageURL: ['/room.png'] } },
      loading: false,
    });
  });

  it('renders BookedCard correctly', () => {
    render(<BookedCard confirmedBooking={mockBooking} />);
    expect(screen.getByTestId('Booked-Card')).toBeInTheDocument();
    expect(screen.getByText(/Hotel Test/)).toBeInTheDocument();
    expect(screen.getByText(/Room A/)).toBeInTheDocument();
  });

  it('renders adults info correctly', () => {
    render(<BookedCard confirmedBooking={{ ...mockBooking, adults: 0 }} />);
    expect(screen.getByTestId('Information-Of-Previous-Card')).toHaveTextContent('0 adults');
  });

  it('calls router.push when View Detail button is clicked', () => {
    render(<BookedCard confirmedBooking={mockBooking} />);
    const button = screen.getByRole('button', { name: /View Detail/i });
    fireEvent.click(button);
    expect(pushMock).toHaveBeenCalledWith('./detail');
  });

  it('applies green background when status is Booked', () => {
    render(<BookedCard confirmedBooking={mockBooking} />);
    const statusDiv = screen.getByText('Booked');
    expect(statusDiv).toHaveClass('bg-[#18BA51]');
  });
  it('renders fallback image when imageURL is empty', () => {
    mockUseGetRoomForBookingQuery.mockReturnValueOnce({
      data: {
        getRoom: {
          id: 'r1',
          name: 'Room A',
          __typename: 'Room',
          status: 'Booked',
          imageURL: [],
        },
      },
      loading: false,
    });

    render(<BookedCard confirmedBooking={mockBooking} />);

    const img = screen.getByAltText(/Room picture/i);
    expect(img);
  });
});
