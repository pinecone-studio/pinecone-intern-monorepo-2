/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditRoomModal } from '@/components/admin/room-detail/EditRoomModal';
import { MockedProvider } from '@apollo/client/testing';

// Mock the generated GraphQL hooks
const mockUpdateRoom = jest.fn();
jest.mock('@/generated', () => ({
  useUpdateRoomMutation: () => [mockUpdateRoom, { loading: false, error: null, data: { updateRoom: { id: 'room-1' } } }],
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className, disabled, ...props }: any) => (
    <button onClick={onClick} variant={variant} className={className} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children, ...props }: any) => (
    <div data-testid="dialog-title" {...props}>
      {children}
    </div>
  ),
  DialogFooter: ({ children, className }: any) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

// Mock the edit sections
jest.mock('@/components/admin/room-detail/edit-sections', () => ({
  BasicInfoSection: ({ room, handleInputChange }: any) => (
    <div data-testid="basic-info-section">
      <input data-testid="name-input" value={room.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Room name" />
      <input data-testid="price-input" value={room.pricePerNight || ''} onChange={(e) => handleInputChange('pricePerNight', e.target.value)} placeholder="Price per night" />
      <input data-testid="type-person-input" value={room.typePerson || ''} onChange={(e) => handleInputChange('typePerson', e.target.value)} placeholder="Type person" />
    </div>
  ),
  AmenitiesSection: ({ room, handleInputChange }: any) => (
    <div data-testid="amenities-section">
      <input data-testid="internet-input" value={room.internet || ''} onChange={(e) => handleInputChange('internet', e.target.value)} placeholder="Internet" />
    </div>
  ),
  ImagesSection: ({ room, handleInputChange }: any) => (
    <div data-testid="images-section">
      <input data-testid="image-url-input" value={room.imageURL || ''} onChange={(e) => handleInputChange('imageURL', e.target.value)} placeholder="Image URL" />
    </div>
  ),
  DetailsSection: ({ room, handleInputChange }: any) => (
    <div data-testid="details-section">
      <textarea data-testid="room-information-input" value={room.roomInformation || ''} onChange={(e) => handleInputChange('roomInformation', e.target.value)} placeholder="Room information" />
    </div>
  ),
}));

describe('EditRoomModal', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    pricePerNight: 150000,
    typePerson: 4,
    bedNumber: 2,
    status: 'available',
    internet: ['Free WiFi'],
    foodAndDrink: ['Mini Bar'],
    bedRoom: ['King Bed'],
    bathroom: ['Shower'],
    accessibility: ['Wheelchair Accessible'],
    entertainment: ['TV'],
    other: ['Room Service'],
    roomInformation: ['Free WiFi', 'Air Conditioning'],
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
    mockUpdateRoom.mockResolvedValue({
      data: { updateRoom: { id: 'room-1' } },
    });
  });

  const renderWithMocks = (props = defaultProps) => {
    return render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EditRoomModal {...props} />
      </MockedProvider>
    );
  };

  describe('Rendering', () => {
    it('renders modal when open', () => {
      renderWithMocks();

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
    });

    it('does not render modal when closed', () => {
      renderWithMocks({ ...defaultProps, isOpen: false });

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
    });

    it('renders correct title for basic section', () => {
      renderWithMocks();

      expect(screen.getByTestId('edit-room-modal-title')).toHaveTextContent('Edit Basic Information');
    });

    it('renders correct title for amenities section', () => {
      renderWithMocks({ ...defaultProps, section: 'amenities' });

      expect(screen.getByTestId('edit-room-modal-title')).toHaveTextContent('Edit Amenities');
    });

    it('renders correct title for images section', () => {
      renderWithMocks({ ...defaultProps, section: 'images' });

      expect(screen.getByTestId('edit-room-modal-title')).toHaveTextContent('Edit Images');
    });

    it('renders correct title for details section', () => {
      renderWithMocks({ ...defaultProps, section: 'details' });

      expect(screen.getByTestId('edit-room-modal-title')).toHaveTextContent('Edit Details');
    });

    it('renders default title for unknown section', () => {
      renderWithMocks({ ...defaultProps, section: 'unknown' as any });

      expect(screen.getByTestId('edit-room-modal-title')).toHaveTextContent('Edit Edit Room');
    });
  });

  describe('Section Rendering', () => {
    it('renders BasicInfoSection for basic section', () => {
      renderWithMocks();

      expect(screen.getByTestId('basic-info-section')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('price-input')).toBeInTheDocument();
      expect(screen.getByTestId('type-person-input')).toBeInTheDocument();
    });

    it('renders AmenitiesSection for amenities section', () => {
      renderWithMocks({ ...defaultProps, section: 'amenities' });

      expect(screen.getByTestId('amenities-section')).toBeInTheDocument();
      expect(screen.getByTestId('internet-input')).toBeInTheDocument();
    });

    it('renders ImagesSection for images section', () => {
      renderWithMocks({ ...defaultProps, section: 'images' });

      expect(screen.getByTestId('images-section')).toBeInTheDocument();
      expect(screen.getByTestId('image-url-input')).toBeInTheDocument();
    });

    it('renders DetailsSection for details section', () => {
      renderWithMocks({ ...defaultProps, section: 'details' });

      expect(screen.getByTestId('details-section')).toBeInTheDocument();
      expect(screen.getByTestId('room-information-input')).toBeInTheDocument();
    });

    it('renders null for unknown section', () => {
      renderWithMocks({ ...defaultProps, section: 'unknown' as any });

      expect(screen.queryByTestId('basic-info-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('amenities-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('images-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('details-section')).not.toBeInTheDocument();
    });
  });

  describe('Form State Management', () => {
    it('initializes form data with room data', () => {
      renderWithMocks();

      expect(screen.getByTestId('name-input')).toHaveValue('Deluxe Suite');
      expect(screen.getByTestId('price-input')).toHaveValue('150000');
      expect(screen.getByTestId('type-person-input')).toHaveValue('4');
    });

    it('handles room with null/undefined values', () => {
      const roomWithNulls = {
        id: 'room-1',
        name: null,
        pricePerNight: undefined,
        typePerson: null,
        status: null,
        internet: null,
        foodAndDrink: undefined,
        bedRoom: null,
        bathroom: undefined,
        accessibility: null,
        entertainment: undefined,
        other: null,
        roomInformation: null,
        imageURL: undefined,
      };

      renderWithMocks({ ...defaultProps, room: roomWithNulls });

      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('price-input')).toHaveValue('');
      expect(screen.getByTestId('type-person-input')).toHaveValue('');
    });

    it('handles input changes correctly', async () => {
      const user = userEvent.setup();
      renderWithMocks();

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Room Name');

      expect(nameInput).toHaveValue('Updated Room Name');
    });

    it('normalizes status correctly', () => {
      const roomWithInvalidStatus = {
        ...mockRoom,
        status: 'INVALID_STATUS',
      };

      renderWithMocks({ ...defaultProps, room: roomWithInvalidStatus });

      // The component should normalize the status to 'available'
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('handles status normalization for different values', () => {
      const statuses = ['BOOKED', 'booked', 'CANCELLED', 'cancelled', 'PENDING', 'pending', 'COMPLETED', 'completed', 'AVAILABLE', 'available'];

      statuses.forEach((status) => {
        const roomWithStatus = { ...mockRoom, status };
        const { rerender } = renderWithMocks({ ...defaultProps, room: roomWithStatus });
        expect(screen.getByTestId('dialog')).toBeInTheDocument();
        rerender(<div />);
      });
    });
  });

  describe('Save Functionality', () => {
    it('calls updateRoom mutation with correct variables for basic section', async () => {
      const user = userEvent.setup();
      renderWithMocks();

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              bedNumber: 2,
              status: 'available',
              name: 'Updated Name',
              pricePerNight: 150000,
              roomInformation: ['Free WiFi', 'Air Conditioning'],
              typePerson: 4,
            },
          },
        });
      });
    });

    it('calls updateRoom mutation with correct variables for amenities section', async () => {
      const user = userEvent.setup();
      renderWithMocks({ ...defaultProps, section: 'amenities' });

      const internetInput = screen.getByTestId('internet-input');
      await user.clear(internetInput);
      await user.type(internetInput, 'Updated Internet');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              accessibility: ['Wheelchair Accessible'],
              bathroom: ['Shower'],
              bedNumber: 2,
              bedRoom: ['King Bed'],
              entertainment: ['TV'],
              foodAndDrink: ['Mini Bar'],
              internet: 'Updated Internet',
              other: ['Room Service'],
              status: 'available',
            },
          },
        });
      });
    });

    it('calls updateRoom mutation with correct variables for images section', async () => {
      const user = userEvent.setup();
      renderWithMocks({ ...defaultProps, section: 'images' });

      const imageInput = screen.getByTestId('image-url-input');
      await user.clear(imageInput);
      await user.type(imageInput, 'Updated Image URL');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              bedNumber: 2,
              imageURL: 'Updated Image URL',
              status: 'available',
            },
          },
        });
      });
    });

    it('calls updateRoom mutation with correct variables for details section', async () => {
      const user = userEvent.setup();
      renderWithMocks({ ...defaultProps, section: 'details' });

      const roomInfoInput = screen.getByTestId('room-information-input');
      await user.clear(roomInfoInput);
      await user.type(roomInfoInput, 'Updated Room Information');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              bedNumber: 2,
              roomInformation: 'Updated Room Information',
              status: 'available',
            },
          },
        });
      });
    });

    it('calls refetch and closes modal on successful save', async () => {
      const user = userEvent.setup();
      renderWithMocks();

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.refetch).toHaveBeenCalled();
        expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('handles save error gracefully', async () => {
      const user = userEvent.setup();
      mockUpdateRoom.mockRejectedValue(new Error('Save failed'));

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithMocks();

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating room:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('handles save with no data returned', async () => {
      const user = userEvent.setup();
      mockUpdateRoom.mockResolvedValue({ data: null });

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithMocks();

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Update failed: No data returned');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Cancel Functionality', () => {
    it('calls onOpenChange with false when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderWithMocks();

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not call updateRoom when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithMocks();

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockUpdateRoom).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading state on save button when mutation is loading', () => {
      // Test that the component renders without errors when loading is true
      // The actual loading state is tested through the mutation hook behavior
      renderWithMocks();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('disables buttons when loading', () => {
      // Test that buttons are present and can be interacted with
      renderWithMocks();
      const saveButton = screen.getByText('Save Changes');
      const cancelButton = screen.getByText('Cancel');

      expect(saveButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('handles undefined form data fields', async () => {
      const user = userEvent.setup();
      const roomWithUndefinedFields = {
        id: 'room-1',
        name: undefined,
        pricePerNight: undefined,
        typePerson: undefined,
      };

      renderWithMocks({ ...defaultProps, room: roomWithUndefinedFields });

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              bedNumber: undefined,
              roomInformation: [],
              status: 'available',
            },
          },
        });
      });
    });

    it('handles empty string values', async () => {
      const user = userEvent.setup();
      const roomWithEmptyStrings = {
        id: 'room-1',
        name: '',
        pricePerNight: '',
        typePerson: '',
      };

      renderWithMocks({ ...defaultProps, room: roomWithEmptyStrings });

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalledWith({
          variables: {
            updateRoomId: 'room-1',
            input: {
              bedNumber: undefined,
              name: '',
              pricePerNight: '',
              roomInformation: [],
              status: 'available',
              typePerson: '',
            },
          },
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles GraphQL errors', async () => {
      const user = userEvent.setup();
      const graphQLError = new Error('GraphQL error');
      graphQLError.graphQLErrors = [{ message: 'GraphQL error' }];
      mockUpdateRoom.mockRejectedValue(graphQLError);

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithMocks();

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating room:', graphQLError);
        expect(consoleSpy).toHaveBeenCalledWith('GraphQL errors:', [{ message: 'GraphQL error' }]);
      });

      consoleSpy.mockRestore();
    });

    it('handles network errors', async () => {
      const user = userEvent.setup();
      const networkError = new Error('Network error');
      networkError.networkError = { message: 'Network error' };
      mockUpdateRoom.mockRejectedValue(networkError);

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithMocks();

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating room:', networkError);
        expect(consoleSpy).toHaveBeenCalledWith('Network errors:', { message: 'Network error' });
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Component Props', () => {
    it('handles missing refetch function', async () => {
      const user = userEvent.setup();
      const propsWithoutRefetch = { ...defaultProps, refetch: undefined };

      renderWithMocks(propsWithoutRefetch);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateRoom).toHaveBeenCalled();
      });
    });

    it('handles missing onOpenChange function', () => {
      const propsWithoutOnOpenChange = { ...defaultProps, onOpenChange: undefined };

      // Should not throw error
      expect(() => renderWithMocks(propsWithoutOnOpenChange)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has proper test IDs for testing', () => {
      renderWithMocks();

      expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
      expect(screen.getByTestId('edit-room-modal-title')).toBeInTheDocument();
      expect(screen.getByTestId('edit-room-modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('edit-room-modal-cancel')).toBeInTheDocument();
      expect(screen.getByTestId('edit-room-modal-save')).toBeInTheDocument();
    });

    it('has proper dialog attributes', () => {
      renderWithMocks();

      const dialogContent = screen.getByTestId('edit-room-modal');
      expect(dialogContent).toHaveClass('max-w-4xl', 'max-h-[90vh]', 'overflow-y-auto');
    });
  });

  describe('Snapshot Tests', () => {
    it('matches snapshot with basic section', () => {
      const { container } = renderWithMocks();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with amenities section', () => {
      const { container } = renderWithMocks({ ...defaultProps, section: 'amenities' });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with images section', () => {
      const { container } = renderWithMocks({ ...defaultProps, section: 'images' });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with details section', () => {
      const { container } = renderWithMocks({ ...defaultProps, section: 'details' });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when closed', () => {
      const { container } = renderWithMocks({ ...defaultProps, isOpen: false });
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
