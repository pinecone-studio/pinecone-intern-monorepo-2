import { BookingHistory } from '@/components/BookingHistory/BookingStory';
import { useOtpContext } from '@/components/providers';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { useGetBookingsByUserIdQuery, useGetUserFirstnameByIdQuery, useHotelNameQuery, useGetRoomForBookingQuery } from '@/generated';
import { useParams } from 'next/navigation';

const mockUserId = '123456789';
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));
jest.mock('@/generated', () => ({
  useGetBookingsByUserIdQuery: jest.fn(),
  useGetUserFirstnameByIdQuery: jest.fn(),
  useHotelNameQuery: jest.fn(),
  useGetRoomForBookingQuery: jest.fn(),
}));

const mockUseHotelNameQuery = useHotelNameQuery as jest.Mock;
const mockUseGetRoomForBookingQuery = useGetRoomForBookingQuery as jest.Mock;
const mockUseOtpContext = useOtpContext as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseGetUserFirstnameByIdQuery = useGetUserFirstnameByIdQuery as jest.Mock;
const mockUseGetBookingsByUserIdQuery = useGetBookingsByUserIdQuery as jest.Mock;

describe('BookingHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ userid: mockUserId });
    mockUseOtpContext.mockReturnValue({
      setBookingSuccess: jest.fn((value) => {
        return value.false;
      }),
    });
    mockUseGetUserFirstnameByIdQuery.mockReturnValue({ data: { user: { firstname: 'John' } } });
  });

  it('1. renders loader when loading', async () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: undefined,
      loading: true,
    });
    const { getByTestId } = render(
      <MockedProvider>
        <BookingHistory />
      </MockedProvider>
    );

    const loaderSvg = getByTestId('Hotel-Loader');
    expect(loaderSvg);
  });

  it('2. Should Booked card will render', async () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      data: {
        getBookingsByUserId: [{ id: '1', status: 'Booked', hotelId: 'h1', roomId: 'r1' }],
      },
      loading: false,
    });
    mockUseHotelNameQuery.mockReturnValue({
      data: { hotel: { name: 'Mock Hotel' } },
    });
    mockUseGetRoomForBookingQuery.mockReturnValue({
      data: { getRoom: { name: 'Mock Room', __typename: 'Room', status: 'Booked', imageURL: ['/mock.png'] } },
    });

    const { getByTestId } = render(
      <MockedProvider>
        <BookingHistory />
      </MockedProvider>
    );
    const bookedCard = getByTestId('Booked-Card');
    expect(bookedCard);
  });

  it('3. Should render Empty bookings history', async () => {
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      loading: false,
      data: { getBookingsByUserId: [] },
    });
    mockUseGetUserFirstnameByIdQuery.mockReturnValue({
      data: { getUserById: { firstName: 'John' } },
    });

    const { getByTestId, getByText } = render(
      <MockedProvider>
        <BookingHistory />
      </MockedProvider>
    );
    const container = getByTestId('Empty-Booking-History');
    expect(container);
    expect(getByText('John, you have no upcoming trips. Where are you going next?')).toBeInTheDocument();
  });
  it('4. Should fallback to empty array when booking is undefined', () => {
    mockUseGetUserFirstnameByIdQuery.mockReturnValue({
      data: { getUserById: { firstName: 'John' } },
    });
    mockUseGetBookingsByUserIdQuery.mockReturnValue({
      loading: false,
      data: { getBookingsByUserId: undefined },
    });
    const { getByTestId, getByText } = render(
      <MockedProvider>
        <BookingHistory />
      </MockedProvider>
    );
    const container = getByTestId('Empty-Booking-History');
    expect(container);
    expect(getByText('John, you have no upcoming trips. Where are you going next?')).toBeInTheDocument();
  });
});
