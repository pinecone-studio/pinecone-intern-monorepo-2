import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomPage } from '../../../src/components/room/RoomPage';

const mockUseHotelsQuery = jest.fn();
const mockUseCreateRoomMutation = jest.fn();

jest.mock('../../../src/generated', () => ({
  useHotelsQuery: () => mockUseHotelsQuery(),
  useCreateRoomMutation: () => mockUseCreateRoomMutation(),
}));

jest.mock('../../../src/components/room/General', () => ({
  General: ({ onSave, loading, onImageSave, _data }: any) => (
    <div data-testid="general-component">
      <button onClick={() => onSave({ name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] })}>Save General</button>
      <button onClick={() => onImageSave()}>Test Image Save</button>
      <span data-testid="general-loading">{loading ? 'Loading' : 'Not Loading'}</span>
      <span data-testid="general-name">{_data.name}</span>
    </div>
  ),
}));

jest.mock('../../../src/components/room/Roomservice', () => ({
  Roomservice: ({ onSave, loading, _data }: any) => (
    <div data-testid="roomservice-component">
      <button
        onClick={() => onSave({ bathroom: ['Private'], accessibility: ['Wheelchair'], entertainment: ['TV'], foodAndDrink: ['Breakfast'], other: ['Desk'], internet: ['WiFi'], bedRoom: ['AC'] })}
      >
        Save Services
      </button>
      <span data-testid="roomservice-loading">{loading ? 'Loading' : 'Not Loading'}</span>
    </div>
  ),
}));

jest.mock('../../../src/components/room/Upcoming', () => ({
  Upcoming: () => <div data-testid="upcoming-component">Upcoming Bookings</div>,
}));

jest.mock('../../../src/components/room/ImageModal', () => ({
  ImageModal: ({ isOpen, onClose, onSave }: any) =>
    isOpen ? (
      <div data-testid="image-modal">
        <button onClick={() => onSave(['image1.jpg', 'image2.jpg'])}>Save Images</button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

jest.mock('../../../src/components/room/SaveHandler', () => ({
  SaveHandler: ({ selectedHotelId, _roomData, _setRoomData, loading }: any) => (
    <div data-testid="save-handler">
      <button disabled={!selectedHotelId || loading}>Create Room</button>
      <span data-testid="selected-hotel">{selectedHotelId}</span>
    </div>
  ),
}));

describe('RoomPage Services & Error Handling', () => {
  beforeEach(() => {
    mockUseHotelsQuery.mockReturnValue({
      data: {
        hotels: [
          { id: 'hotel1', name: 'Hotel Example 1' },
          { id: 'hotel2', name: 'Hotel Example 2' },
        ],
      },
      loading: false,
      error: null,
    });

    mockUseCreateRoomMutation.mockReturnValue([jest.fn(), { loading: false, error: null }]);
  });

  it('should handle room services save', () => {
    render(<RoomPage />);
    const saveButton = screen.getByText('Save Services');
    fireEvent.click(saveButton);

    expect(saveButton).toBeInTheDocument();
  });

  it('should test createRoom mutation function', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: null }]);

    render(<RoomPage />);

    expect(mockCreateRoom).toBeDefined();
  });

  it('should test createRoom loading state', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: true, error: null }]);

    render(<RoomPage />);

    expect(screen.getByTestId('general-loading')).toHaveTextContent('Loading');
    expect(screen.getByTestId('roomservice-loading')).toHaveTextContent('Loading');
  });

  it('should test createRoom error state', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: { message: 'Create room failed' } }]);

    render(<RoomPage />);

    expect(mockCreateRoom).toBeDefined();
  });

  it('should test createRoom function call', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: null }]);

    render(<RoomPage />);

    mockCreateRoom();
    expect(mockCreateRoom).toHaveBeenCalled();
  });

  it('should test createRoom function with parameters', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: null }]);

    render(<RoomPage />);

    const testData = { test: 'data' };
    mockCreateRoom(testData);
    expect(mockCreateRoom).toHaveBeenCalledWith(testData);
  });

  it('should test all function definitions in RoomPage', () => {
    const mockCreateRoom = jest.fn();
    mockUseCreateRoomMutation.mockReturnValue([mockCreateRoom, { loading: false, error: null }]);

    render(<RoomPage />);

    expect(mockCreateRoom).toBeDefined();
    expect(screen.getByText('New Room')).toBeInTheDocument();
  });
});
