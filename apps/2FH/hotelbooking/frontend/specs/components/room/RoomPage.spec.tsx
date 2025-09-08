/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomPage } from '@/components/room/RoomPage';
import { useHotelsQuery, useCreateRoomMutation } from '@/generated';

// Mock dependencies
jest.mock('@/generated', () => ({
  useHotelsQuery: jest.fn(),
  useCreateRoomMutation: jest.fn(),
}));

jest.mock('@/components/room/General', () => ({
  General: ({ onSave, loading, _onImageSave, _data }: any) => (
    <div data-testid="general-component">
      <button onClick={() => onSave({ name: 'Test Room', type: ['double'], pricePerNight: '100', roomInformation: ['wifi'], bedNumber: 2, status: 'available' })}>Save General</button>
      <div>Loading: {loading ? 'true' : 'false'}</div>
    </div>
  ),
}));

jest.mock('@/components/room/Upcoming', () => ({
  Upcoming: () => <div data-testid="upcoming-component">Upcoming Component</div>,
}));

jest.mock('@/components/room/Roomservice', () => ({
  Roomservice: ({ onSave, loading, _data }: any) => (
    <div data-testid="roomservice-component">
      <button onClick={() => onSave({ bathroom: ['shower'], accessibility: [], entertainment: ['tv'], foodAndDrink: [], other: [], internet: ['wifi'], bedRoom: ['air_conditioner'] })}>
        Save Services
      </button>
      <div>Loading: {loading ? 'true' : 'false'}</div>
    </div>
  ),
}));

jest.mock('@/components/room/ImageModal', () => ({
  ImageModal: ({ isOpen, onClose, onSave }: any) =>
    isOpen ? (
      <div data-testid="image-modal">
        <button onClick={() => onSave(['/image1.jpg', '/image2.jpg'])}>Save Images</button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

jest.mock('@/components/room/SaveHandler', () => ({
  SaveHandler: ({ selectedHotelId, roomData, loading }: any) => (
    <div data-testid="save-handler">
      <div>Selected Hotel: {selectedHotelId}</div>
      <div>Room Name: {roomData.general.name}</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
    </div>
  ),
}));

const mockUseHotelsQuery = useHotelsQuery as jest.MockedFunction<typeof useHotelsQuery>;
const mockUseCreateRoomMutation = useCreateRoomMutation as jest.MockedFunction<typeof useCreateRoomMutation>;

describe('RoomPage', () => {
  const mockHotels = [
    { id: 'hotel-1', name: 'Grand Hotel' },
    { id: 'hotel-2', name: 'City Hotel' },
  ];

  const mockCreateRoom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseHotelsQuery.mockReturnValue({
      data: { hotels: mockHotels },
      loading: false,
      error: undefined,
    } as any);

    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: undefined }] as any);
  });

  it('renders room page correctly', () => {
    render(<RoomPage />);

    expect(screen.getByText('New Room')).toBeInTheDocument();
    expect(screen.getByText('Select Hotel')).toBeInTheDocument();
    expect(screen.getByTestId('general-component')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-component')).toBeInTheDocument();
    expect(screen.getByTestId('roomservice-component')).toBeInTheDocument();
    expect(screen.getByTestId('save-handler')).toBeInTheDocument();
  });

  it('displays room name input', () => {
    render(<RoomPage />);

    const nameInput = screen.getByPlaceholderText('Enter room name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
  });

  it('handles room name input change', () => {
    render(<RoomPage />);

    const nameInput = screen.getByPlaceholderText('Enter room name');
    fireEvent.change(nameInput, { target: { value: 'Updated Room Name' } });

    expect(nameInput).toHaveValue('Updated Room Name');
    expect(screen.getByText('Updated Room Name')).toBeInTheDocument();
  });

  it('displays hotel selection dropdown', () => {
    render(<RoomPage />);

    const hotelSelect = screen.getByDisplayValue('Select a hotel');
    expect(hotelSelect).toBeInTheDocument();

    // Check if hotel options are available
    expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('City Hotel')).toBeInTheDocument();
  });

  it('handles hotel selection', () => {
    render(<RoomPage />);

    const hotelSelect = screen.getByDisplayValue('Select a hotel');
    fireEvent.change(hotelSelect, { target: { value: 'hotel-1' } });

    expect(hotelSelect).toHaveValue('hotel-1');
    expect(screen.getByText('Selected Hotel: hotel-1')).toBeInTheDocument();
  });

  it('displays loading state for hotels', () => {
    mockUseHotelsQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any);

    render(<RoomPage />);

    const hotelSelect = screen.getByDisplayValue('Select a hotel');
    expect(hotelSelect).toBeDisabled();
  });

  it('displays hotel loading error', () => {
    const error = new Error('Failed to load hotels');
    mockUseHotelsQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error,
    } as any);

    render(<RoomPage />);

    expect(screen.getByText('Error loading hotels: Failed to load hotels')).toBeInTheDocument();
  });

  it('handles general component save', () => {
    render(<RoomPage />);

    const saveButton = screen.getByText('Save General');
    fireEvent.click(saveButton);

    expect(screen.getByText('Test Room')).toBeInTheDocument();
  });

  it('handles room service component save', () => {
    render(<RoomPage />);

    const saveButton = screen.getByText('Save Services');
    fireEvent.click(saveButton);

    // The component should handle the save without errors
    expect(screen.getByTestId('roomservice-component')).toBeInTheDocument();
  });

  it('handles image modal opening and closing', () => {
    render(<RoomPage />);

    const editImagesButton = screen.getByText('Edit');
    fireEvent.click(editImagesButton);

    expect(screen.getByTestId('image-modal')).toBeInTheDocument();

    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
  });

  it('handles image modal save', () => {
    render(<RoomPage />);

    const editImagesButton = screen.getByText('Edit');
    fireEvent.click(editImagesButton);

    const saveImagesButton = screen.getByText('Save Images');
    fireEvent.click(saveImagesButton);

    // Should close modal and update images
    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
  });

  it('displays no images state initially', () => {
    render(<RoomPage />);

    expect(screen.getByText('No Photos Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Add photos of your rooms, amenities, or property to showcase your hotel.')).toBeInTheDocument();
  });

  it('displays images when available', () => {
    render(<RoomPage />);

    // Open image modal and save images
    const editImagesButton = screen.getByText('Edit');
    fireEvent.click(editImagesButton);

    const saveImagesButton = screen.getByText('Save Images');
    fireEvent.click(saveImagesButton);

    // Should now display the images
    expect(screen.getByAltText('Room image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 2')).toBeInTheDocument();
  });

  it('passes loading state to components', () => {
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: true, error: undefined }] as any);

    render(<RoomPage />);

    // Check that loading state is passed to components
    const loadingElements = screen.getAllByText('Loading: true');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('passes loading state to save handler', () => {
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: true, error: undefined }] as any);

    render(<RoomPage />);

    // Check that loading state is passed to save handler
    const loadingElements = screen.getAllByText('Loading: true');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('handles room name input with special characters', () => {
    render(<RoomPage />);

    const nameInput = screen.getByPlaceholderText('Enter room name');
    fireEvent.change(nameInput, { target: { value: 'Room & Suite @#$%' } });

    expect(nameInput).toHaveValue('Room & Suite @#$%');
    expect(screen.getByText('Room & Suite @#$%')).toBeInTheDocument();
  });

  it('handles room name input with empty string', () => {
    render(<RoomPage />);

    const nameInput = screen.getByPlaceholderText('Enter room name');
    fireEvent.change(nameInput, { target: { value: '' } });

    expect(nameInput).toHaveValue('');
    expect(screen.getByText('New Room')).toBeInTheDocument(); // Should show default
  });

  it('handles room name input with whitespace only', () => {
    render(<RoomPage />);

    const nameInput = screen.getByPlaceholderText('Enter room name');
    fireEvent.change(nameInput, { target: { value: '   ' } });

    expect(nameInput).toHaveValue('   ');
    // Check that the whitespace value is displayed in the save handler
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === 'Room Name:    ';
      })
    ).toBeInTheDocument();
  });

  it('handles room name input with very long text', () => {
    render(<RoomPage />);

    const longName = 'A'.repeat(1000);
    const nameInput = screen.getByPlaceholderText('Enter room name');
    fireEvent.change(nameInput, { target: { value: longName } });

    expect(nameInput).toHaveValue(longName);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles hotel selection with empty value', () => {
    render(<RoomPage />);

    const hotelSelect = screen.getByDisplayValue('Select a hotel');
    fireEvent.change(hotelSelect, { target: { value: '' } });

    expect(hotelSelect).toHaveValue('');
    expect(screen.getByText('Selected Hotel:')).toBeInTheDocument();
  });

  it('handles multiple image modal operations', () => {
    render(<RoomPage />);

    // Open modal first time
    const editImagesButton = screen.getByText('Edit');
    fireEvent.click(editImagesButton);
    expect(screen.getByTestId('image-modal')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();

    // Open modal second time
    fireEvent.click(editImagesButton);
    expect(screen.getByTestId('image-modal')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<RoomPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
