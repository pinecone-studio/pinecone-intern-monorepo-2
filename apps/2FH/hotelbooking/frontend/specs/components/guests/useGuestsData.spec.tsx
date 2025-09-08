/* eslint-disable  */
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useGuestsData } from '@/components/guests/useGuestsData';
import { useGetAllBookingsQuery, useHotelsQuery, useGetUserByIdLazyQuery } from '@/generated';

// Mock the generated hooks
jest.mock('@/generated', () => ({
  useGetAllBookingsQuery: jest.fn(),
  useHotelsQuery: jest.fn(),
  useGetUserByIdLazyQuery: jest.fn(),
}));

const mockUseGetAllBookingsQuery = useGetAllBookingsQuery as jest.MockedFunction<typeof useGetAllBookingsQuery>;
const mockUseHotelsQuery = useHotelsQuery as jest.MockedFunction<typeof useHotelsQuery>;
const mockUseGetUserByIdLazyQuery = useGetUserByIdLazyQuery as jest.MockedFunction<typeof useGetUserByIdLazyQuery>;

describe('useGuestsData', () => {
  const mockBookings = [
    {
      id: 'booking-1',
      userId: 'user-1',
      hotelId: 'hotel-1',
      roomId: 'room-1',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-18',
      adults: 2,
      children: 1,
      status: 'BOOKED',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
    },
    {
      id: 'booking-2',
      userId: 'user-2',
      hotelId: 'hotel-2',
      roomId: 'room-2',
      checkInDate: '2024-01-20',
      checkOutDate: '2024-01-22',
      adults: 1,
      children: 0,
      status: 'COMPLETED',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  ];

  const mockHotels = [
    {
      id: 'hotel-1',
      name: 'Grand Hotel',
    },
    {
      id: 'hotel-2',
      name: 'City Hotel',
    },
  ];

  const mockUsers = {
    'user-1': {
      firstName: 'John',
      lastName: 'Doe',
    },
    'user-2': {
      firstName: 'Jane',
      lastName: 'Smith',
    },
  };

  const mockGetUserById = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: mockHotels },
      loading: false,
      error: undefined,
    } as any);

    mockUseGetUserByIdLazyQuery.mockReturnValue([
      mockGetUserById,
      {
        data: undefined,
        loading: false,
        error: undefined,
      },
    ] as any);

    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      return Promise.resolve({
        data: { getUserById: mockUsers[userId] },
      });
    });
  });

  it('returns loading state initially', () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.bookings).toEqual([]);
    expect(result.current.error).toBeUndefined();
  });

  it('returns error state when bookings query fails', () => {
    const errorMessage = 'Failed to fetch bookings';
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.bookings).toEqual([]);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('returns error state when hotels query fails', async () => {
    const errorMessage = 'Failed to fetch hotels';
    mockUseHotelsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    // Even when hotels query fails, bookings are still processed with "Unknown Hotel"
    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0].hotel).toBe('Unknown Hotel');
    // The hook only returns error from bookings query, not hotels query
    expect(result.current.error).toBeUndefined();
  });

  it('processes bookings data correctly', async () => {
    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0]).toMatchObject({
      id: 'ng-1', // Last 4 digits of booking-1
      originalId: 'booking-1',
      name: 'John Doe',
      hotel: 'Grand Hotel',
      status: 'BOOKED',
    });
    expect(result.current.bookings[1]).toMatchObject({
      id: 'ng-2', // Last 4 digits of booking-2
      originalId: 'booking-2',
      name: 'Jane Smith',
      hotel: 'City Hotel',
      status: 'COMPLETED',
    });
  });

  it('handles missing user data gracefully', async () => {
    mockGetUserById.mockResolvedValue({
      data: { getUserById: null },
    });

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0].name).toBe('Guest user-1');
    expect(result.current.bookings[1].name).toBe('Guest user-2');
  });

  it('handles missing hotel data gracefully', async () => {
    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: [] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0].hotel).toBe('Unknown Hotel');
    expect(result.current.bookings[1].hotel).toBe('Unknown Hotel');
  });

  it('formats date ranges correctly', async () => {
    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].date).toMatch(/Jan \d+ - Jan \d+/);
    expect(result.current.bookings[1].date).toMatch(/Jan \d+ - Jan \d+/);
  });

  it('formats guest counts correctly', async () => {
    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].guests).toBe('2 Adults, 1 Child');
    expect(result.current.bookings[1].guests).toBe('1 Adult');
  });

  it('covers usersMap creation with empty users data', async () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: mockBookings },
      loading: false,
      error: undefined,
    } as any);

    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: mockHotels },
      loading: false,
      error: undefined,
    } as any);

    mockUseGetUserByIdLazyQuery.mockReturnValue([
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
      },
    ] as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test that the usersMap is created even with empty users data (line 90)
    // This covers the case where usersData is empty and returns a new Map()
    expect(result.current.bookings[0].name).toContain('Guest'); // Fallback name
  });

  it('covers guests formatting with complex scenarios', async () => {
    const bookingsWithComplexGuests = [
      {
        ...mockBookings[0],
        adults: 1,
        children: 1,
      },
      {
        ...mockBookings[1],
        adults: 3,
        children: 2,
      },
      {
        ...mockBookings[0],
        id: 'booking-3',
        adults: 0,
        children: 0,
      },
    ];

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: bookingsWithComplexGuests },
      loading: false,
      error: undefined,
    } as any);

    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: mockHotels },
      loading: false,
      error: undefined,
    } as any);

    mockUseGetUserByIdLazyQuery.mockReturnValue([
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
      },
    ] as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test the guests formatting logic (line 111)
    expect(result.current.bookings[0].guests).toBe('1 Adult, 1 Child');
    expect(result.current.bookings[1].guests).toBe('3 Adults, 2 Children');
    expect(result.current.bookings[2].guests).toBe('1 Adult'); // Fallback when adults is 0
  });

  it('generates room types correctly', async () => {
    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].rooms).toMatch(/(Room|Suite)/);
    expect(result.current.bookings[1].rooms).toMatch(/(Room|Suite)/);
  });

  it('handles empty bookings array', async () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toEqual([]);
  });

  it('handles null bookings data', async () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toEqual([]);
  });

  it('handles user fetch errors gracefully', async () => {
    mockGetUserById.mockRejectedValue(new Error('User fetch failed'));

    const { result } = renderHook(() => useGuestsData(), {
      wrapper: ({ children }) => <MockedProvider>{children}</MockedProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0].name).toBe('Guest user-1');
    expect(result.current.bookings[1].name).toBe('Guest user-2');
  });
});
