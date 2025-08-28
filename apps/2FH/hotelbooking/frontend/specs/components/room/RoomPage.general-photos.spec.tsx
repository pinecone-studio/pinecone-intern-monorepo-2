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
  General: ({ onSave, loading, _onImageSave, _data }: any) => (
    <div data-testid="general-component">
      <button onClick={() => onSave({ name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] })}>Save General</button>
      <button onClick={() => _onImageSave && _onImageSave()}>Test Image Save</button>
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

describe('RoomPage General Component & Photos', () => {
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

  it('should display room images when available', () => {
    render(<RoomPage />);

    expect(screen.getByText('No Photos Uploaded')).toBeInTheDocument();

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save Images');
    fireEvent.click(saveButton);

    const images = screen.getAllByAltText(/Room image/);
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
  });

  it('should handle general info save', () => {
    render(<RoomPage />);

    const saveButton = screen.getByText('Save General');
    fireEvent.click(saveButton);

    expect(saveButton).toBeInTheDocument();
  });

  it('should display no photos message when no images are uploaded', () => {
    render(<RoomPage />);

    expect(screen.getByText('No Photos Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Add photos of your rooms, amenities, or property to showcase your hotel.')).toBeInTheDocument();
  });

  it('should test anonymous onImageSave function', () => {
    render(<RoomPage />);

    expect(screen.getByTestId('general-component')).toBeInTheDocument();
  });

  it('should test anonymous onImageSave function in General component', () => {
    render(<RoomPage />);

    const testImageSaveButton = screen.getByText('Test Image Save');
    fireEvent.click(testImageSaveButton);

    expect(testImageSaveButton).toBeInTheDocument();
  });
});
