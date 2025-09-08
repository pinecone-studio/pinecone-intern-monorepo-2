/* eslint-disable  */
import { renderHook } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useBookingDetailData } from '@/components/guests/useBookingDetailData';
import { useGetBookingQuery, useHotelQuery, useGetRoomQuery, useGetUserByIdQuery } from '@/generated';

// Mock the generated hooks
jest.mock('@/generated', () => ({
  useGetBookingQuery: jest.fn(),
  useHotelQuery: jest.fn(),
  useGetRoomQuery: jest.fn(),
  useGetUserByIdQuery: jest.fn(),
}));

const mockUseGetBookingQuery = useGetBookingQuery as jest.MockedFunction<typeof useGetBookingQuery>;
const mockUseHotelQuery = useHotelQuery as jest.MockedFunction<typeof useHotelQuery>;
const mockUseGetRoomQuery = useGetRoomQuery as jest.MockedFunction<typeof useGetRoomQuery>;
const mockUseGetUserByIdQuery = useGetUserByIdQuery as jest.MockedFunction<typeof useGetUserByIdQuery>;

describe('useBookingDetailData', () => {
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

  const mockHotel = {
    id: 'hotel-1',
    name: 'Grand Hotel',
  };

  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    pricePerNight: 150000,
  };

  const mockUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGetBookingQuery.mockReturnValue({
      data: { getBooking: mockBooking },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    mockUseHotelQuery.mockReturnValue({
      data: { hotel: mockHotel },
      loading: false,
      error: undefined,
    } as any);

    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
    } as any);

    mockUseGetUserByIdQuery.mockReturnValue({
      data: { getUserById: mockUser },
      loading: false,
      error: undefined,
    } as any);
  });

  it('returns loading state initially', () => {
    mockUseGetBookingQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    mockUseHotelQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    mockUseGetUserByIdQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.booking).toBeUndefined();
    expect(result.current.room).toBeUndefined();
    expect(result.current.guestInfo).toBeDefined();
    expect(result.current.error).toBeUndefined();
  });

  it('returns error state when booking query fails', () => {
    const errorMessage = 'Failed to fetch booking';
    mockUseGetBookingQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.booking).toBeUndefined();
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('returns booking data when available', () => {
    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.booking).toEqual(mockBooking);
    expect(result.current.hotel).toEqual(mockHotel);
    expect(result.current.room).toEqual(mockRoom);
    expect(result.current.error).toBeUndefined();
  });

  it('creates guest info from user data', () => {
    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.guestInfo).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+976 99112233',
      guestRequest: 'No Request',
      roomNumber: 'Room #m-1',
    });
  });

  it('creates fallback guest info when user data is missing', () => {
    mockUseGetUserByIdQuery.mockReturnValue({
      data: { getUserById: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.guestInfo).toEqual({
      firstName: 'Guest',
      lastName: 'user-1',
      email: 'user-1@example.com',
      phone: '+976 99112233',
      guestRequest: 'No Request',
      roomNumber: 'Room #m-1',
    });
  });

  it('creates fallback guest info when user data is incomplete', () => {
    const incompleteUser = {
      id: 'user-1',
      firstName: 'John',
      lastName: null,
      email: null,
    };

    mockUseGetUserByIdQuery.mockReturnValue({
      data: { getUserById: incompleteUser },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.guestInfo).toEqual({
      firstName: 'John',
      lastName: 'user-1',
      email: 'user-1@example.com',
      phone: '+976 99112233',
      guestRequest: 'No Request',
      roomNumber: 'Room #m-1',
    });
  });

  it('handles missing hotel data', () => {
    mockUseHotelQuery.mockReturnValue({
      data: { hotel: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.hotel).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles missing room data', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.room).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('skips dependent queries when booking data is not available', () => {
    mockUseGetBookingQuery.mockReturnValue({
      data: { getBooking: null },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(mockUseHotelQuery).toHaveBeenCalledWith({
      variables: { hotelId: '' },
      skip: true,
    });

    expect(mockUseGetRoomQuery).toHaveBeenCalledWith({
      variables: { getRoomId: '' },
      skip: true,
    });

    expect(mockUseGetUserByIdQuery).toHaveBeenCalledWith({
      variables: { input: { _id: '' } },
      skip: true,
    });
  });

  it('calls dependent queries with correct variables when booking data is available', () => {
    renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(mockUseHotelQuery).toHaveBeenCalledWith({
      variables: { hotelId: 'hotel-1' },
      skip: false,
    });

    expect(mockUseGetRoomQuery).toHaveBeenCalledWith({
      variables: { getRoomId: 'room-1' },
      skip: false,
    });

    expect(mockUseGetUserByIdQuery).toHaveBeenCalledWith({
      variables: { input: { _id: 'user-1' } },
      skip: false,
    });
  });

  it('returns loading state when any query is loading', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(true);
  });

  it('provides onStatusUpdate function that calls refetch', () => {
    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    result.current.onStatusUpdate();

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('handles booking with missing userId', () => {
    const bookingWithoutUserId = {
      ...mockBooking,
      userId: null,
    };

    mockUseGetBookingQuery.mockReturnValue({
      data: { getBooking: bookingWithoutUserId },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    mockUseGetUserByIdQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.guestInfo).toEqual({
      firstName: 'Guest',
      lastName: '',
      email: '@example.com',
      phone: '+976 99112233',
      guestRequest: 'No Request',
      roomNumber: 'Room #m-1',
    });
  });

  it('handles booking with missing roomId', () => {
    const bookingWithoutRoomId = {
      ...mockBooking,
      roomId: null,
    };

    mockUseGetBookingQuery.mockReturnValue({
      data: { getBooking: bookingWithoutRoomId },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.guestInfo.roomNumber).toBe('Room #');
  });

  it('handles booking with missing hotelId', () => {
    const bookingWithoutHotelId = {
      ...mockBooking,
      hotelId: null,
    };

    mockUseGetBookingQuery.mockReturnValue({
      data: { getBooking: bookingWithoutHotelId },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    mockUseHotelQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useBookingDetailData('booking-1'), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.hotel).toBeUndefined();
  });

  it('handles empty booking ID', () => {
    const { result } = renderHook(() => useBookingDetailData(''), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(mockUseGetBookingQuery).toHaveBeenCalledWith({
      variables: { getBookingId: '' },
      skip: true,
    });
  });

  it('handles null booking ID', () => {
    const { result } = renderHook(() => useBookingDetailData(null as any), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(mockUseGetBookingQuery).toHaveBeenCalledWith({
      variables: { getBookingId: null },
      skip: true,
    });
  });
});
