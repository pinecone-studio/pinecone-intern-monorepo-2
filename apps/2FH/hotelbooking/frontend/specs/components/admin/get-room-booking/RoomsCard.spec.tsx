/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomsCard from '@/components/admin/get-room-booking/RoomsCard';
import { useGetRoomsQuery } from '@/generated';

// Mock the generated hook
jest.mock('@/generated', () => ({
  useGetRoomsQuery: jest.fn(),
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

const mockUseGetRoomsQuery = useGetRoomsQuery as jest.MockedFunction<typeof useGetRoomsQuery>;

describe('RoomsCard', () => {
  const mockHotelId = 'hotel-123';
  const mockRooms = [
    {
      id: 'room-1',
      name: 'Deluxe Suite',
      bedNumber: 2,
      typePerson: 4,
      pricePerNight: 150000,
    },
    {
      id: 'room-2',
      name: 'Standard Room',
      bedNumber: 1,
      typePerson: 2,
      pricePerNight: 80000,
    },
    {
      id: 'room-3',
      name: 'Family Room',
      bedNumber: 3,
      typePerson: 6,
      pricePerNight: 200000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Rooms')).toBeInTheDocument();
    // Check for loading spinner
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load rooms';
    mockUseGetRoomsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText(`Error loading rooms: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders empty state when no rooms', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: [] },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('No rooms found')).toBeInTheDocument();
  });

  it('renders rooms list with correct data', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: mockRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByText('Standard Room')).toBeInTheDocument();
    expect(screen.getByText('Family Room')).toBeInTheDocument();
  });

  it('displays room details correctly', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: mockRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    // Check bed numbers
    expect(screen.getByText('2 Beds')).toBeInTheDocument();
    expect(screen.getByText('1 Beds')).toBeInTheDocument();
    expect(screen.getByText('3 Beds')).toBeInTheDocument();

    // Check people capacity
    expect(screen.getByText('4 People')).toBeInTheDocument();
    expect(screen.getByText('2 People')).toBeInTheDocument();
    expect(screen.getByText('6 People')).toBeInTheDocument();

    // Check prices
    expect(screen.getByText('150000MNT/night')).toBeInTheDocument();
    expect(screen.getByText('80000MNT/night')).toBeInTheDocument();
    expect(screen.getByText('200000MNT/night')).toBeInTheDocument();
  });

  it('displays summary statistics correctly', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: mockRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('3')).toBeInTheDocument(); // Total rooms
    expect(screen.getByText('Total Rooms')).toBeInTheDocument();
    expect(screen.getByText('143333')).toBeInTheDocument(); // Average price (rounded)
    expect(screen.getByText('Avg Price')).toBeInTheDocument();
  });

  it('handles room click navigation', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: mockRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    const roomRow = screen.getByText('Deluxe Suite').closest('div');
    fireEvent.click(roomRow!);

    expect(mockPush).toHaveBeenCalledWith('/admin/room/room-1');
  });

  it('renders rooms correctly with mixed data types', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: {
        getRooms: [
          {
            id: 'room-1',
            name: 'Deluxe Suite',
            pricePerNight: 200,
            imageURL: ['image1.jpg'],
            typePerson: 'Double',
            roomInformation: ['WiFi', 'AC'],
            bathroom: ['Private'],
            accessibility: ['Wheelchair'],
            internet: ['WiFi'],
            foodAndDrink: ['Breakfast'],
            bedRoom: ['AC'],
            other: ['Desk'],
            entertainment: ['TV'],
            bedNumber: 1,
            status: 'AVAILABLE',
          },
        ],
      },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
      networkStatus: 7,
      called: true,
      client: {} as any,
      previousData: undefined,
      variables: { hotelId: mockHotelId },
      fetchMore: jest.fn(),
      subscribeToMore: jest.fn(),
      updateQuery: jest.fn(),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    // The component should render without errors
    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
  });

  it('handles Add Room button click', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: mockRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    const addRoomButton = screen.getByText('Add Room');
    fireEvent.click(addRoomButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/add-room');
  });

  it('handles missing room data gracefully', () => {
    const roomsWithMissingData = [
      {
        id: 'room-incomplete',
        name: 'Incomplete Room',
        bedNumber: null,
        typePerson: null,
        pricePerNight: null,
      },
    ];

    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: roomsWithMissingData },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Incomplete Room')).toBeInTheDocument();
    expect(screen.getByText('N/A Beds')).toBeInTheDocument();
    expect(screen.getByText('N/A People')).toBeInTheDocument();
    expect(screen.getByText('0MNT/night')).toBeInTheDocument();
  });

  it('limits displayed rooms to 5', () => {
    const manyRooms = Array.from({ length: 10 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      bedNumber: 1,
      typePerson: 2,
      pricePerNight: 100000,
    }));

    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: manyRooms },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    // Should only show first 5 rooms
    expect(screen.getByText('Room 1')).toBeInTheDocument();
    expect(screen.getByText('Room 5')).toBeInTheDocument();
    expect(screen.queryByText('Room 6')).not.toBeInTheDocument();
    expect(screen.queryByText('Room 10')).not.toBeInTheDocument();

    // But total count should show all 10
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates average price correctly for empty rooms array', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: [] },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 zero values (total rooms and avg price)
    expect(screen.getByText('Avg Price')).toBeInTheDocument();
  });

  it('calculates average price correctly for rooms with zero prices', () => {
    const roomsWithZeroPrices = [
      {
        id: 'room-1',
        name: 'Free Room',
        bedNumber: 1,
        typePerson: 2,
        pricePerNight: 0,
      },
      {
        id: 'room-2',
        name: 'Another Free Room',
        bedNumber: 1,
        typePerson: 2,
        pricePerNight: 0,
      },
    ];

    mockUseGetRoomsQuery.mockReturnValue({
      data: { getRooms: roomsWithZeroPrices },
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('0')).toBeInTheDocument(); // Average price should be 0
    expect(screen.getByText('Avg Price')).toBeInTheDocument();
  });

  it('handles undefined rooms data', () => {
    mockUseGetRoomsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    render(<RoomsCard hotelId={mockHotelId} />);

    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('No rooms found')).toBeInTheDocument();
  });
});
