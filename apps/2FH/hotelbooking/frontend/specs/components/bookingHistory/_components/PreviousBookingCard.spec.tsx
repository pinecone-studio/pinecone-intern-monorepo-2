import { PreviousBookingCard } from '@/components/BookingHistory/_components/PreviousBookingCard';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent } from '@testing-library/react';

const mockUseHotelNameQuery = jest.fn();
const mockUseGetRoomForBookingQuery = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/generated', () => ({
  useHotelNameQuery: () => mockUseHotelNameQuery(),
  useGetRoomForBookingQuery: () => mockUseGetRoomForBookingQuery(),
}));

describe('PreviousBookingCard Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('next/navigation', () => {
      return {
        useRouter: () => ({
          push: jest.fn(),
        }),
      };
    });

    mockUseHotelNameQuery.mockReturnValue({
      data: { hotel: { name: 'Hotel A' } },
      loading: false,
    });

    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: { getRoom: { id: 'r1', name: 'Room A', __typename: 'Room', imageURL: ['/room.png'] } },
      loading: false,
    });
  });

  it('renders Previous Booking Card correctly', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <PreviousBookingCard hotelId="h1" roomId="r1" checkInDate="2025-09-08" adults={2} status="Completed" />
      </MockedProvider>
    );

    expect(getByTestId('Image-Id')).toBeInTheDocument();
    expect(getByTestId('Hotel-Name')).toBeInTheDocument();
    expect(getByTestId('room-name')).toBeInTheDocument();
    expect(getByTestId('View-Detail-Btn')).toBeInTheDocument();
  });

  it('calls router.push when "View Detail" button is clicked', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <PreviousBookingCard hotelId="h1" roomId="r1" checkInDate="2025-09-08" adults={2} status="Cancelled" />
      </MockedProvider>
    );

    fireEvent.click(getByTestId('View-Detail-Btn'));
    expect(pushMock);
  });

  it('it should render if roomdata image is empty /Images/NoImage.png', async () => {
    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: { getRoom: { id: 'r1', name: 'Room A', __typename: 'Room', imageURL: [] } },
      loading: false,
    });

    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <PreviousBookingCard hotelId="XX" roomId="XX" checkInDate="2025-09-08" adults={2} status="Cancelled" />
      </MockedProvider>
    );

    expect(getByTestId('Image-Id')).toBeInTheDocument();
  });

  it('applies bg-gray-400 class when status is empty', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <PreviousBookingCard hotelId="h1" roomId="r1" checkInDate="2025-09-08" adults={2} status="" />
      </MockedProvider>
    );

    const statusDiv = getByTestId('Status-Color');
    expect(statusDiv).toHaveClass('bg-gray-400');
  });
  it('does not render adults info when adults=0', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <PreviousBookingCard hotelId="h1" roomId="r1" checkInDate="2025-09-08" adults={0} status="Pending" />
      </MockedProvider>
    );

    const container = getByTestId('Information-Of-Previous-Card');
    expect(container).toBeInTheDocument();
  });
 
});
