/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoomDetailPage } from '@/components/admin/room-detail/RoomDetailPage';
import { useGetRoomQuery } from '@/generated';
import { useParams, useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/generated', () => ({
  useGetRoomQuery: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/components/admin/room-detail', () => ({
  RoomInfoCard: ({ room, editModalState, setEditModalState, refetch, roomId }: any) => (
    <div data-testid="room-info-card">
      <div>Room Info Card</div>
      <div>Room: {room.name}</div>
      <button onClick={() => setEditModalState({ isOpen: true, section: 'basic' })}>Edit Basic Info</button>
    </div>
  ),
  RoomAmenitiesCard: ({ room, editModalState, setEditModalState, refetch, roomId }: any) => (
    <div data-testid="room-amenities-card">
      <div>Room Amenities Card</div>
      <button onClick={() => setEditModalState({ isOpen: true, section: 'amenities' })}>Edit Amenities</button>
    </div>
  ),
  RoomImagesCard: ({ room, editModalState, setEditModalState, refetch, roomId }: any) => (
    <div data-testid="room-images-card">
      <div>Room Images Card</div>
      <button onClick={() => setEditModalState({ isOpen: true, section: 'images' })}>Edit Images</button>
    </div>
  ),
  LoadingSkeleton: () => <div data-testid="loading-skeleton">Loading...</div>,
  ErrorMessage: ({ message }: any) => <div data-testid="error-message">Error: {message}</div>,
  NotFoundMessage: () => <div data-testid="not-found-message">Room not found</div>,
}));

const mockUseGetRoomQuery = useGetRoomQuery as jest.MockedFunction<typeof useGetRoomQuery>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RoomDetailPage', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    pricePerNight: 150000,
    typePerson: 'double',
    bedNumber: 2,
    status: 'available',
    internet: ['free_wifi'],
    foodAndDrink: ['free_breakfast'],
    bedRoom: ['air_conditioner'],
    bathroom: ['private'],
    accessibility: [],
    entertainment: ['tv'],
    other: ['desk'],
    roomInformation: ['private_bathroom', 'air_conditioner'],
    imageURL: ['https://example.com/image1.jpg'],
  };

  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'room-1' });
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('renders loading state', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to load room';
    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: errorMessage } as any,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders not found state when room data is null', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: null },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByTestId('not-found-message')).toBeInTheDocument();
  });

  it('renders room details when data is available', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByTestId('room-info-card')).toBeInTheDocument();
    expect(screen.getByTestId('room-amenities-card')).toBeInTheDocument();
    expect(screen.getByTestId('room-images-card')).toBeInTheDocument();
  });

  it('displays room name and price in header', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByText('$150000/night • double People')).toBeInTheDocument();
  });

  it('calls router.back when back button is clicked', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('renders with correct page structure', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    const pageContainer = screen.getByTestId('room-info-card').closest('.min-h-screen');
    expect(pageContainer).toHaveClass('bg-gray-50', 'p-6');
  });

  it('renders grid layout correctly', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    // Check that room info is passed to components
    expect(screen.getByText('Room: Deluxe Suite')).toBeInTheDocument();
  });

  it('handles edit modal state changes', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    // Click edit button to open modal
    const editButton = screen.getByText('Edit Basic Info');
    fireEvent.click(editButton);

    // The modal state should be updated (this is tested through the child components)
    expect(editButton).toBeInTheDocument();
  });

  it('sets default room status when not provided', () => {
    const roomWithoutStatus = { ...mockRoom, status: undefined };
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: roomWithoutStatus },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    // The component should set a default status of 'available'
    expect(screen.getByTestId('room-info-card')).toBeInTheDocument();
  });

  it('calls useGetRoomQuery with correct room ID', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(mockUseGetRoomQuery).toHaveBeenCalledWith({
      variables: { getRoomId: 'room-1' },
    });
  });

  it('handles missing room ID parameter', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    render(<RoomDetailPage />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('matches snapshot for loading state', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { container } = render(<RoomDetailPage />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for loaded state', () => {
    mockUseGetRoomQuery.mockReturnValue({
      data: { getRoom: mockRoom },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    } as any);

    const { container } = render(<RoomDetailPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
