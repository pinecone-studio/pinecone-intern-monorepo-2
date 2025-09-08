/* eslint-disable */
import React from 'react';
import { render, screen, waitFor } from '@/TestUtils';
import userEvent from '@testing-library/user-event';
import { EditHotelModal } from '@/components/admin/hotel-detail/EditHotelModal';

// Mock the useMutation hook
const mockUpdateHotel = jest.fn();
const mockUpdateLoading = jest.fn();

jest.mock('@apollo/client', () => ({
  useMutation: () => [mockUpdateHotel, { loading: mockUpdateLoading() }],
  gql: jest.fn(),
}));

// Mock the edit section components
jest.mock('@/components/admin/hotel-detail/edit-sections', () => ({
  BasicInfoSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="basic-info-section">
      <input data-testid="name-input" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
    </div>
  ),
  LocationSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="location-section">
      <input data-testid="city-input" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
    </div>
  ),
  AmenitiesSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="amenities-section">
      <input data-testid="amenities-input" value={formData.amenities?.join(', ') || ''} onChange={(e) => handleInputChange('amenities', e.target.value.split(', '))} />
    </div>
  ),
  LanguagesSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="languages-section">
      <input data-testid="languages-input" value={formData.languages?.join(', ') || ''} onChange={(e) => handleInputChange('languages', e.target.value.split(', '))} />
    </div>
  ),
  PoliciesSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="policies-section">
      <input data-testid="policies-input" value={formData.policies?.join(', ') || ''} onChange={(e) => handleInputChange('policies', e.target.value.split(', '))} />
    </div>
  ),
  FAQSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="faq-section">
      <input data-testid="faq-input" value={formData.faq?.join(', ') || ''} onChange={(e) => handleInputChange('faq', e.target.value.split(', '))} />
    </div>
  ),
  ImagesSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="images-section">
      <input data-testid="images-input" value={formData.images?.join(', ') || ''} onChange={(e) => handleInputChange('images', e.target.value.split(', '))} />
    </div>
  ),
  DetailsSection: ({ formData, handleInputChange }: any) => (
    <div data-testid="details-section">
      <input data-testid="description-input" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
    </div>
  ),
}));

// Mock console.error and window.alert
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('EditHotelModal', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    description: 'A luxurious hotel in the heart of the city.',
    phone: '123-456-7890',
    city: 'New York',
    country: 'USA',
    location: '123 Main Street',
    stars: 4,
    rating: 4.5,
    amenities: ['WIFI', 'POOL', 'GYM'],
    languages: ['English', 'Spanish'],
    policies: ['No smoking', 'No pets'],
    faq: [
      { question: 'Check-in time?', answer: '2 PM' },
      { question: 'Check-out time?', answer: '11 AM' },
    ],
    images: ['image1.jpg', 'image2.jpg'],
    optionalExtras: [{ youNeedToKnow: 'Free breakfast', weShouldMention: 'Available 6-10 AM' }],
  };

  const mockOnOpenChange = jest.fn();
  const mockRefetch = jest.fn();
  const mockHotelId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateLoading.mockReturnValue(false);
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockAlert.mockRestore();
  });

  describe('Basic Rendering', () => {
    it('renders the modal with correct title for basic section', () => {
      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Basic Information');
      expect(screen.getByTestId('basic-info-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for location section', () => {
      render(<EditHotelModal hotel={mockHotel} section="location" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Location');
      expect(screen.getByTestId('location-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for amenities section', () => {
      render(<EditHotelModal hotel={mockHotel} section="amenities" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Amenities');
      expect(screen.getByTestId('amenities-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for languages section', () => {
      render(<EditHotelModal hotel={mockHotel} section="languages" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Languages');
      expect(screen.getByTestId('languages-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for policies section', () => {
      render(<EditHotelModal hotel={mockHotel} section="policies" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Policies');
      expect(screen.getByTestId('policies-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for faq section', () => {
      render(<EditHotelModal hotel={mockHotel} section="faq" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit FAQ');
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for images section', () => {
      render(<EditHotelModal hotel={mockHotel} section="images" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Images');
      expect(screen.getByTestId('images-section')).toBeInTheDocument();
    });

    it('renders the modal with correct title for details section', () => {
      render(<EditHotelModal hotel={mockHotel} section="details" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Details');
      expect(screen.getByTestId('details-section')).toBeInTheDocument();
    });

    it('renders save and cancel buttons', () => {
      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-save')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-cancel')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Invalid Section Handling', () => {
    it('returns null for invalid section in getSectionComponent', () => {
      render(<EditHotelModal hotel={mockHotel} section="invalid-section" as any isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // The modal should render but the content should be empty
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-content')).toBeInTheDocument();

      // No section components should be rendered
      expect(screen.queryByTestId('basic-info-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('location-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('amenities-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('languages-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('policies-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('faq-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('images-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('details-section')).not.toBeInTheDocument();
    });

    it('uses fallback title for invalid section', () => {
      render(<EditHotelModal hotel={mockHotel} section="invalid-section" as any isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
    });

    it('handles undefined section', () => {
      render(<EditHotelModal hotel={mockHotel} section={undefined as any} isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
    });

    it('handles null section', () => {
      render(<EditHotelModal hotel={mockHotel} section={null as any} isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
    });
  });

  describe('Cancel Button Functionality', () => {
    it('calls onOpenChange(false) when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      const cancelButton = screen.getByTestId('edit-hotel-modal-cancel');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange(false) only once when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      const cancelButton = screen.getByTestId('edit-hotel-modal-cancel');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Save Changes - Success Scenario', () => {
    it('calls refetch and onOpenChange(false) when update is successful', async () => {
      const user = userEvent.setup();

      // Mock successful update
      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: true } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change a field to trigger update
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateHotel).toHaveBeenCalledWith({
          variables: {
            updateHotelId: mockHotelId,
            hotel: { name: 'Updated Hotel Name' },
          },
        });
      });

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('calls refetch and onOpenChange(false) only once when update is successful', async () => {
      const user = userEvent.setup();

      // Mock successful update
      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: true } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change a field to trigger update
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalledTimes(1);
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Save Changes - Failure Scenario', () => {
    it('logs error and shows alert when update fails', async () => {
      const user = userEvent.setup();

      // Mock failed update
      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: false, message: 'Error' } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change a field to trigger update
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to update hotel:', 'Error');
        expect(mockAlert).toHaveBeenCalledWith('Failed to update hotel. Please try again.');
      });
    });

    it('logs error and shows alert when update fails with unknown error', async () => {
      const user = userEvent.setup();

      // Mock failed update with no message
      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: false } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change a field to trigger update
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to update hotel:', 'Unknown error');
        expect(mockAlert).toHaveBeenCalledWith('Failed to update hotel. Please try again.');
      });
    });

    it('logs error and shows alert when update throws exception', async () => {
      const user = userEvent.setup();

      // Mock update throwing an error
      mockUpdateHotel.mockRejectedValue(new Error('Network error'));

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change a field to trigger update
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Error updating hotel:', expect.any(Error));
        expect(mockAlert).toHaveBeenCalledWith('Error updating hotel. Please try again.');
      });
    });
  });

  describe('No Changes Scenario', () => {
    it('calls onOpenChange(false) immediately when no fields have changed', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click save button without making any changes
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      // Should call onOpenChange(false) immediately without calling updateHotel
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      expect(mockUpdateHotel).not.toHaveBeenCalled();
    });

    it('calls onOpenChange(false) only once when no fields have changed', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click save button without making any changes
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('shows loading state when update is in progress', () => {
      mockUpdateLoading.mockReturnValue(true);

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-save')).toBeDisabled();
      expect(screen.getByTestId('edit-hotel-modal-cancel')).toBeDisabled();
    });

    it('shows normal state when not loading', () => {
      mockUpdateLoading.mockReturnValue(false);

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-save')).not.toBeDisabled();
      expect(screen.getByTestId('edit-hotel-modal-cancel')).not.toBeDisabled();
    });
  });

  describe('Form Data Handling', () => {
    it('updates form data when input changes', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Hotel Name');

      expect(nameInput).toHaveValue('New Hotel Name');
    });

    it('handles multiple field changes', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="location" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      const cityInput = screen.getByTestId('city-input');
      await user.clear(cityInput);
      await user.type(cityInput, 'Los Angeles');

      expect(cityInput).toHaveValue('Los Angeles');
    });

    it('handles array field changes', async () => {
      const user = userEvent.setup();

      render(<EditHotelModal hotel={mockHotel} section="amenities" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      const amenitiesInput = screen.getByTestId('amenities-input');
      await user.clear(amenitiesInput);
      await user.type(amenitiesInput, 'WIFI, SPA, RESTAURANT');

      expect(amenitiesInput).toHaveValue('WIFI, SPA, RESTAURANT');
    });
  });

  describe('Update Data Generation', () => {
    it('only includes changed fields in update data', async () => {
      const user = userEvent.setup();

      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: true } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change only the name field
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateHotel).toHaveBeenCalledWith({
          variables: {
            updateHotelId: mockHotelId,
            hotel: { name: 'Updated Hotel Name' },
          },
        });
      });
    });

    it('includes multiple changed fields in update data', async () => {
      const user = userEvent.setup();

      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: true } },
      });

      render(<EditHotelModal hotel={mockHotel} section="details" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Change the description field
      const descriptionInput = screen.getByTestId('description-input');
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated description');

      // Click save button
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateHotel).toHaveBeenCalledWith({
          variables: {
            updateHotelId: mockHotelId,
            hotel: { description: 'Updated description' },
          },
        });
      });
    });
  });

  describe('Integration Tests', () => {
    it('handles complete save workflow with success', async () => {
      const user = userEvent.setup();

      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: true } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Make changes
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Save changes
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      // Verify the complete workflow
      await waitFor(() => {
        expect(mockUpdateHotel).toHaveBeenCalledWith({
          variables: {
            updateHotelId: mockHotelId,
            hotel: { name: 'Updated Hotel Name' },
          },
        });
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('handles complete save workflow with failure', async () => {
      const user = userEvent.setup();

      mockUpdateHotel.mockResolvedValue({
        data: { updateHotel: { success: false, message: 'Update failed' } },
      });

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Make changes
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hotel Name');

      // Save changes
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      await user.click(saveButton);

      // Verify error handling
      await waitFor(() => {
        expect(mockUpdateHotel).toHaveBeenCalledWith({
          variables: {
            updateHotelId: mockHotelId,
            hotel: { name: 'Updated Hotel Name' },
          },
        });
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to update hotel:', 'Update failed');
        expect(mockAlert).toHaveBeenCalledWith('Failed to update hotel. Please try again.');
        expect(mockRefetch).not.toHaveBeenCalled();
        expect(mockOnOpenChange).not.toHaveBeenCalled();
      });
    });
  });
});
