/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { LocationCard } from '@/components/admin/hotel-detail/LocationCard';

// Mock the EditHotelModal component
jest.mock('@/components/admin/hotel-detail/EditHotelModal', () => ({
  EditHotelModal: function MockEditHotelModal({ hotel: _hotel, section, isOpen, onOpenChange, refetch: _refetch, hotelId: _hotelId }: any) {
    return (
      <div data-testid="edit-hotel-modal" data-section={section} data-is-open={isOpen} onClick={() => onOpenChange && onOpenChange(true)}>
        Mock EditHotelModal
      </div>
    );
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: ({ size, className }: any) => (
    <div data-testid="map-pin-icon" data-size={size} className={className}>
      📍
    </div>
  ),
  Phone: ({ size, className }: any) => (
    <div data-testid="phone-icon" data-size={size} className={className}>
      📞
    </div>
  ),
}));

describe('LocationCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    location: '123 Main Street, Downtown',
    city: 'New York',
    country: 'USA',
    phone: '+1-555-123-4567',
  };

  const mockEditModalState = {
    isOpen: false,
    section: 'basic' as const,
  };

  const mockSetEditModalState = jest.fn();
  const mockRefetch = jest.fn();
  const mockHotelId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the location card with title', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Detailed Location')).toBeInTheDocument();
    });

    it('renders hotel location information correctly', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
      expect(screen.getByText('123 Main Street, Downtown')).toBeInTheDocument();
      expect(screen.getByText('New York, USA')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
    });

    it('renders location information with correct data-testid', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const cityCountryElement = screen.getByTestId('city-country');
      expect(cityCountryElement).toBeInTheDocument();
      expect(cityCountryElement).toHaveTextContent('New York, USA');
    });

    it('renders icons correctly', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const mapPinIcon = screen.getByTestId('map-pin-icon');
      const phoneIcon = screen.getByTestId('phone-icon');

      expect(mapPinIcon).toBeInTheDocument();
      expect(phoneIcon).toBeInTheDocument();
      expect(mapPinIcon).toHaveAttribute('data-size', '20');
      expect(phoneIcon).toHaveAttribute('data-size', '16');
    });
  });

  describe('Edit Button Functionality', () => {
    it('renders edit button with correct styling', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('calls setEditModalState with correct parameters when edit button is clicked', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'location' });
    });

    it('calls setEditModalState only once when edit button is clicked', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'location');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'location' as const,
      };

      render(<LocationCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'location' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Tests', () => {
    it('handles both edit button click and modal onOpenChange correctly', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'location' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'location' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'location');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('Detailed Location')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<LocationCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('Detailed Location')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('handles hotel with different location data', () => {
      const differentHotel = {
        id: '2',
        name: 'Seaside Resort',
        location: '456 Beach Road, Coastal Area',
        city: 'Miami',
        country: 'USA',
        phone: '+1-555-987-6543',
      };

      render(<LocationCard hotel={differentHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Seaside Resort')).toBeInTheDocument();
      expect(screen.getByText('456 Beach Road, Coastal Area')).toBeInTheDocument();
      expect(screen.getByText('Miami, USA')).toBeInTheDocument();
      expect(screen.getByText('+1-555-987-6543')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles hotel with missing optional fields gracefully', () => {
      const hotelWithMissingFields = {
        id: '3',
        name: 'Basic Hotel',
        location: 'Simple Location',
        city: 'Simple City',
        country: 'Simple Country',
        // phone is missing
      };

      render(<LocationCard hotel={hotelWithMissingFields} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Basic Hotel')).toBeInTheDocument();
      expect(screen.getByText('Simple Location')).toBeInTheDocument();
      expect(screen.getByText('Simple City, Simple Country')).toBeInTheDocument();
      // Should not crash when phone is missing
    });

    it('handles hotel with empty string values', () => {
      const hotelWithEmptyStrings = {
        id: '4',
        name: 'Empty Hotel',
        location: '',
        city: '',
        country: '',
        phone: '',
      };

      render(<LocationCard hotel={hotelWithEmptyStrings} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Empty Hotel')).toBeInTheDocument();
      expect(screen.getByTestId('city-country')).toHaveTextContent(',');
      // Should not crash with empty strings
    });
  });
});
