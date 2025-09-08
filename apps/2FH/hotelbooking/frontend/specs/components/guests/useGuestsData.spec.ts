/* eslint-disable  */
import { renderHook, waitFor } from '@testing-library/react';
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
      adults: 2,
      children: 1,
      checkInDate: '2024-02-01',
      checkOutDate: '2024-02-03',
      status: 'BOOKED' as const,
    },
    {
      id: 'booking-2',
      userId: 'user-2',
      hotelId: 'hotel-2',
      roomId: 'room-2',
      adults: 1,
      children: 0,
      checkInDate: '2024-02-05',
      checkOutDate: '2024-02-07',
      status: 'COMPLETED' as const,
    },
  ];

  const mockHotels = [
    { id: 'hotel-1', name: 'Grand Hotel' },
    { id: 'hotel-2', name: 'City Hotel' },
  ];

  const mockUsers = {
    'user-1': { firstName: 'John', lastName: 'Doe' },
    'user-2': { firstName: 'Jane', lastName: 'Smith' },
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

    mockUseGetUserByIdLazyQuery.mockReturnValue([mockGetUserById, { loading: false, error: undefined }] as any);

    // Mock successful user fetches
    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      return Promise.resolve({
        data: { getUserById: mockUsers[userId as keyof typeof mockUsers] },
      });
    });
  });

  it('returns transformed booking data', async () => {
    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0]).toMatchObject({
      id: 'ng-1', // Last 4 characters of 'booking-1' with padding
      originalId: 'booking-1',
      name: 'John Doe',
      hotel: 'Grand Hotel',
      rooms: expect.any(String),
      guests: '2 Adults, 1 Child',
      date: expect.any(String),
      status: 'BOOKED',
    });
  });

  it('handles loading state', () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.loading).toBe(true);
  });

  it('handles error state', () => {
    const error = new Error('Failed to fetch bookings');
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.error).toBe(error);
  });

  it('handles empty bookings data', () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings).toHaveLength(0);
  });

  it('handles null bookings data', () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings).toHaveLength(0);
  });

  it('handles undefined bookings data', () => {
    mockUseGetAllBookingsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings).toHaveLength(0);
  });

  it('handles empty hotels data', () => {
    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: [] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].hotel).toBe('Unknown Hotel');
  });

  it('handles null hotels data', () => {
    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: null },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].hotel).toBe('Unknown Hotel');
  });

  it('handles undefined hotels data', () => {
    mockUseHotelsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].hotel).toBe('Unknown Hotel');
  });

  it('handles user fetch error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockGetUserById.mockRejectedValue(new Error('User fetch failed'));

    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(consoleError).toHaveBeenCalledWith('Error fetching user user-1:', expect.any(Error));
    expect(result.current.bookings[0].name).toBe('Guest user-1'); // Fallback name

    consoleError.mockRestore();
  });

  it('handles user with no name data', async () => {
    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      return Promise.resolve({
        data: { getUserById: { firstName: undefined, lastName: undefined } },
      });
    });

    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].name).toBe('Guest user-1'); // Fallback name
  });

  it('handles user with partial name data', async () => {
    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      if (userId === 'user-1') {
        return Promise.resolve({
          data: { getUserById: { firstName: 'John', lastName: undefined } },
        });
      }
      return Promise.resolve({
        data: { getUserById: { firstName: undefined, lastName: 'Smith' } },
      });
    });

    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].name).toBe('John'); // Only first name
    expect(result.current.bookings[1].name).toBe('Smith'); // Only last name
  });

  it('handles user with empty string names', async () => {
    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      return Promise.resolve({
        data: { getUserById: { firstName: '', lastName: '' } },
      });
    });

    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].name).toBe('Guest user-1'); // Fallback name
  });

  it('handles user with whitespace-only names', async () => {
    mockGetUserById.mockImplementation(({ variables }) => {
      const userId = variables.input._id;
      return Promise.resolve({
        data: { getUserById: { firstName: '   ', lastName: '   ' } },
      });
    });

    const { result } = renderHook(() => useGuestsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.bookings[0].name).toBe('Guest user-1'); // Fallback name
  });

  it('handles booking with no adults', () => {
    const bookingWithNoAdults = {
      ...mockBookings[0],
      adults: undefined,
      children: undefined, // Also remove children to test the default case
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithNoAdults] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('1 Adult'); // Default to 1 adult
  });

  it('handles booking with no children', () => {
    const bookingWithNoChildren = {
      ...mockBookings[0],
      children: undefined,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithNoChildren] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('2 Adults'); // No children mentioned
  });

  it('handles booking with zero children', () => {
    const bookingWithZeroChildren = {
      ...mockBookings[0],
      children: 0,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithZeroChildren] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('2 Adults'); // No children mentioned
  });

  it('handles booking with multiple children', () => {
    const bookingWithMultipleChildren = {
      ...mockBookings[0],
      children: 3,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithMultipleChildren] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('2 Adults, 3 Children');
  });

  it('handles booking with single child', () => {
    const bookingWithSingleChild = {
      ...mockBookings[0],
      children: 1,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithSingleChild] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('2 Adults, 1 Child');
  });

  it('handles booking with single adult', () => {
    const bookingWithSingleAdult = {
      ...mockBookings[0],
      adults: 1,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithSingleAdult] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('1 Adult, 1 Child');
  });

  it('handles booking with multiple adults', () => {
    const bookingWithMultipleAdults = {
      ...mockBookings[0],
      adults: 4,
    };

    mockUseGetAllBookingsQuery.mockReturnValue({
      data: { bookings: [bookingWithMultipleAdults] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].guests).toBe('4 Adults, 1 Child');
  });

  it('generates different room types for different room IDs', () => {
    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].rooms).not.toBe(result.current.bookings[1].rooms);
  });

  it('formats date range correctly', () => {
    const { result } = renderHook(() => useGuestsData());

    expect(result.current.bookings[0].date).toMatch(/Feb \d+ - Feb \d+/);
  });

  it('handles loading state from hotels query', () => {
    mockUseHotelsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.loading).toBe(true);
  });

  it('handles loading state from users query', async () => {
    mockUseGetUserByIdLazyQuery.mockReturnValue([mockGetUserById, { loading: true, error: undefined }] as any);

    const { result } = renderHook(() => useGuestsData());

    expect(result.current.loading).toBe(true);
  });
});
