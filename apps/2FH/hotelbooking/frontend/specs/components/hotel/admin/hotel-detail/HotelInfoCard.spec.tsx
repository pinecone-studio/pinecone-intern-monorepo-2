/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { HotelInfoCard } from '@/components/admin/hotel-detail/HotelInfoCard';

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
  Star: ({ size, className }: any) => (
    <div data-testid="star-icon" data-size={size} className={className}>
      ⭐
    </div>
  ),
  Phone: ({ size, className }: any) => (
    <div data-testid="phone-icon" data-size={size} className={className}>
      📞
    </div>
  ),
}));

describe('HotelInfoCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    phone: '+1-555-123-4567',
    rating: 8.5,
    stars: 4,
    description: 'A luxurious hotel in the heart of the city with excellent amenities and service.',
  };

  const mockEditModalState = {
    isOpen: false,
    section: 'location' as const,
  };

  const mockSetEditModalState = jest.fn();
  const mockRefetch = jest.fn();
  const mockHotelId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the hotel info card with title', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('General Information')).toBeInTheDocument();
    });

    it('renders hotel information correctly', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByText('8.5/10')).toBeInTheDocument();
      expect(screen.getByText('A luxurious hotel in the heart of the city with excellent amenities and service.')).toBeInTheDocument();
    });

    it('renders section labels correctly', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText('User Rating')).toBeInTheDocument();
      expect(screen.getByText('Stars')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders icons correctly', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starIcons = screen.getAllByTestId('star-icon');
      const phoneIcon = screen.getByTestId('phone-icon');

      expect(starIcons.length).toBeGreaterThan(0);
      expect(phoneIcon).toBeInTheDocument();
      expect(phoneIcon).toHaveAttribute('data-size', '16');
    });
  });

  describe('Stars Display and getStarsText Function', () => {
    it('displays correct number of stars for integer value', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(4);
      expect(screen.getByText('(4 stars)')).toBeInTheDocument();
    });

    it('displays correct stars text for number stars', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('(4 stars)')).toBeInTheDocument();
    });

    it('handles string stars value correctly', () => {
      const hotelWithStringStars = {
        ...mockHotel,
        stars: '5',
      };

      render(<HotelInfoCard hotel={hotelWithStringStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(5);
      expect(screen.getByText('(5 stars)')).toBeInTheDocument();
    });

    it('handles undefined stars correctly', () => {
      const hotelWithUndefinedStars = {
        ...mockHotel,
        stars: undefined,
      };

      render(<HotelInfoCard hotel={hotelWithUndefinedStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(0);
      expect(screen.getByText('(undefined stars)')).toBeInTheDocument();
    });

    it('handles null stars correctly', () => {
      const hotelWithNullStars = {
        ...mockHotel,
        stars: null,
      };

      render(<HotelInfoCard hotel={hotelWithNullStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(0);
      expect(screen.getByText('(null stars)')).toBeInTheDocument();
    });

    it('handles NaN stars correctly', () => {
      const hotelWithNaNStars = {
        ...mockHotel,
        stars: NaN,
      };

      render(<HotelInfoCard hotel={hotelWithNaNStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(0);
      expect(screen.getByText('(NaN stars)')).toBeInTheDocument();
    });

    it('handles decimal stars correctly', () => {
      const hotelWithDecimalStars = {
        ...mockHotel,
        stars: 3.7,
      };

      render(<HotelInfoCard hotel={hotelWithDecimalStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(3); // Math.floor(3.7) = 3
      expect(screen.getByText('(3.7 stars)')).toBeInTheDocument();
    });

    it('handles zero stars correctly', () => {
      const hotelWithZeroStars = {
        ...mockHotel,
        stars: 0,
      };

      render(<HotelInfoCard hotel={hotelWithZeroStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(0);
      expect(screen.getByText('(0 stars)')).toBeInTheDocument();
    });

    it('handles negative stars correctly', () => {
      const hotelWithNegativeStars = {
        ...mockHotel,
        stars: -2,
      };

      render(<HotelInfoCard hotel={hotelWithNegativeStars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');

      expect(starIcons).toHaveLength(0); // Math.max(0, Math.floor(-2)) = 0
      expect(screen.getByText('(-2 stars)')).toBeInTheDocument();
    });
  });

  describe('Edit Button Functionality', () => {
    it('renders edit button with correct styling', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('calls setEditModalState with correct parameters when edit button is clicked', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'basic' });
    });

    it('calls setEditModalState only once when edit button is clicked', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'basic');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'basic' as const,
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'basic' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Tests', () => {
    it('handles both edit button click and modal onOpenChange correctly', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'basic' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'basic' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'basic');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('General Information')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByText('8.5/10')).toBeInTheDocument();
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<HotelInfoCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('General Information')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('handles hotel with different data', () => {
      const differentHotel = {
        id: '2',
        name: 'Seaside Resort',
        phone: '+1-555-987-6543',
        rating: 9.2,
        stars: 5,
        description: 'A beautiful beachfront resort with stunning ocean views.',
      };

      render(<HotelInfoCard hotel={differentHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Seaside Resort')).toBeInTheDocument();
      expect(screen.getByText('+1-555-987-6543')).toBeInTheDocument();
      expect(screen.getByText('9.2/10')).toBeInTheDocument();
      expect(screen.getByText('A beautiful beachfront resort with stunning ocean views.')).toBeInTheDocument();

      const starsContainer = screen.getByTestId('stars-container');
      const starIcons = starsContainer.querySelectorAll('[data-testid="star-icon"]');
      expect(starIcons).toHaveLength(5);
      expect(screen.getByText('(5 stars)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles hotel with missing optional fields gracefully', () => {
      const hotelWithMissingFields = {
        id: '3',
        name: 'Basic Hotel',
        // phone is missing
        rating: 7.0,
        stars: 3,
        description: 'A simple hotel.',
      };

      render(<HotelInfoCard hotel={hotelWithMissingFields} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Basic Hotel')).toBeInTheDocument();
      expect(screen.getByText('7/10')).toBeInTheDocument();
      expect(screen.getByText('A simple hotel.')).toBeInTheDocument();
      // Should not crash when phone is missing
    });

    it('handles hotel with empty string values', () => {
      const hotelWithEmptyStrings = {
        id: '4',
        name: '',
        phone: '',
        rating: 0,
        stars: 0,
        description: '',
      };

      render(<HotelInfoCard hotel={hotelWithEmptyStrings} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('0/10')).toBeInTheDocument();
      expect(screen.getByText('(0 stars)')).toBeInTheDocument();
      // Should not crash with empty strings
    });
  });
});
