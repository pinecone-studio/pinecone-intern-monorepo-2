/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditRoomModal } from '@/components/admin/room-detail/EditRoomModal';
import { useUpdateRoomMutation } from '@/generated';
jest.mock('@/generated', () => ({
  useUpdateRoomMutation: jest.fn(),
}));
jest.mock('@/components/admin/room-detail/edit-sections', () => ({
  BasicInfoSection: ({ room, handleInputChange }: any) => (
    <div data-testid="basic-info-section">
      <input data-testid="room-name-input" value={room.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Room name" />
      <input data-testid="room-information-input" value={room.roomInformation || ''} onChange={(e) => handleInputChange('roomInformation', e.target.value)} placeholder="Room information" />
    </div>
  ),
  AmenitiesSection: ({ handleInputChange }: any) => (
    <div data-testid="amenities-section">
      <button data-testid="set-internet" onClick={() => handleInputChange('internet', ['wifi'])}>
        Set Internet
      </button>
      <button data-testid="set-food" onClick={() => handleInputChange('foodAndDrink', ['breakfast'])}>
        Set Food
      </button>
      <button data-testid="set-bedroom" onClick={() => handleInputChange('bedRoom', ['ac'])}>
        Set Bedroom
      </button>
      <button data-testid="set-bathroom" onClick={() => handleInputChange('bathroom', ['shower'])}>
        Set Bathroom
      </button>
      <button data-testid="set-accessibility" onClick={() => handleInputChange('accessibility', ['wheelchair'])}>
        Set Accessibility
      </button>
      <button data-testid="set-entertainment" onClick={() => handleInputChange('entertainment', ['tv'])}>
        Set Entertainment
      </button>
      <button data-testid="set-other" onClick={() => handleInputChange('other', ['desk'])}>
        Set Other
      </button>
    </div>
  ),
  ImagesSection: ({ handleInputChange }: any) => (
    <div data-testid="images-section">
      <button data-testid="set-images" onClick={() => handleInputChange('imageURL', ['new-image.jpg'])}>
        Set Images
      </button>
    </div>
  ),
  DetailsSection: ({ handleInputChange }: any) => (
    <div data-testid="details-section">
      <button data-testid="set-details" onClick={() => handleInputChange('roomInformation', ['new-detail'])}>
        Set Details
      </button>
    </div>
  ),
}));
const mockUpdateRoom = jest.fn();
const mockUseUpdateRoomMutation = useUpdateRoomMutation as jest.MockedFunction<typeof useUpdateRoomMutation>;
describe('EditRoomModal', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Test Room',
    pricePerNight: 100,
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
  const defaultProps = {
    room: mockRoom,
    section: 'basic' as const,
    isOpen: true,
    onOpenChange: jest.fn(),
    refetch: jest.fn(),
    roomId: 'room-1',
  };
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUpdateRoomMutation.mockReturnValue([mockUpdateRoom, { loading: false, error: undefined }] as any);
  });
  it('renders modal when open', () => {
    render(<EditRoomModal {...defaultProps} />);
    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
  });
  it('renders correct section components', () => {
    render(<EditRoomModal {...defaultProps} section="basic" />);
    expect(screen.getByTestId('basic-info-section')).toBeInTheDocument();

    render(<EditRoomModal {...defaultProps} section="amenities" />);
    expect(screen.getByTestId('amenities-section')).toBeInTheDocument();

    render(<EditRoomModal {...defaultProps} section="images" />);
    expect(screen.getByTestId('images-section')).toBeInTheDocument();

    render(<EditRoomModal {...defaultProps} section="details" />);
    expect(screen.getByTestId('details-section')).toBeInTheDocument();
  });
  it('calls onOpenChange when cancel is clicked', () => {
    const onOpenChange = jest.fn();
    render(<EditRoomModal {...defaultProps} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByTestId('edit-room-modal-cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('handles basic section input changes', () => {
    render(<EditRoomModal {...defaultProps} />);
    const nameInput = screen.getByTestId('room-name-input');
    fireEvent.change(nameInput, { target: { value: 'Updated Room' } });
    expect(nameInput).toHaveValue('Updated Room');
  });
  it('calls updateRoom mutation for basic section', async () => {
    mockUpdateRoom.mockResolvedValue({ data: { updateRoom: { id: 'room-1' } } } as any);
    const refetch = jest.fn().mockResolvedValue({});
    const onOpenChange = jest.fn();
    render(<EditRoomModal {...defaultProps} refetch={refetch} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByTestId('edit-room-modal-save'));
    await waitFor(() => {
      expect(mockUpdateRoom).toHaveBeenCalled();
      expect(refetch).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
  it('covers line 59, 61-67, 69-71 conditions with undefined formData', async () => {
    mockUpdateRoom.mockResolvedValue({ data: { updateRoom: { id: 'room-1' } } } as any);
    const refetch = jest.fn().mockResolvedValue({});
    const onOpenChange = jest.fn();
    const minimalRoom = {
      id: 'room-1',
      bedNumber: 1,
      status: undefined,
    };
    const { rerender } = render(<EditRoomModal room={minimalRoom} section="basic" refetch={refetch} onOpenChange={onOpenChange} isOpen={true} roomId="room-1" />);
    fireEvent.click(screen.getByTestId('edit-room-modal-save'));
    await waitFor(() => {
      expect(mockUpdateRoom).toHaveBeenCalledWith({
        variables: {
          updateRoomId: 'room-1',
          input: { bedNumber: 1, status: 'available', roomInformation: [] },
        },
      });
    });
    rerender(<EditRoomModal room={minimalRoom} section="amenities" refetch={refetch} onOpenChange={onOpenChange} isOpen={true} roomId="room-1" />);
    fireEvent.click(screen.getByTestId('edit-room-modal-save'));
    await waitFor(() => {
      expect(mockUpdateRoom).toHaveBeenCalledWith({
        variables: {
          updateRoomId: 'room-1',
          input: {
            bedNumber: 1,
            status: 'available',
            internet: [],
            foodAndDrink: [],
            bedRoom: [],
            bathroom: [],
            accessibility: [],
            entertainment: [],
            other: [],
          },
        },
      });
    });
    rerender(<EditRoomModal room={minimalRoom} section="images" refetch={refetch} onOpenChange={onOpenChange} isOpen={true} roomId="room-1" />);
    fireEvent.click(screen.getByTestId('edit-room-modal-save'));
    await waitFor(() => {
      expect(mockUpdateRoom).toHaveBeenCalledWith({
        variables: { updateRoomId: 'room-1', input: { bedNumber: 1, status: 'available', imageURL: [] } },
      });
    });

    // Details section
    rerender(<EditRoomModal room={minimalRoom} section="details" refetch={refetch} onOpenChange={onOpenChange} isOpen={true} roomId="room-1" />);
    fireEvent.click(screen.getByTestId('edit-room-modal-save'));
    await waitFor(() => {
      expect(mockUpdateRoom).toHaveBeenCalledWith({
        variables: { updateRoomId: 'room-1', input: { bedNumber: 1, status: 'available', roomInformation: [] } },
      });
    });
  });
});
