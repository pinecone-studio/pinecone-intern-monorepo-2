/* eslint-disable  */
import React from 'react';
import { render, screen } from '@/TestUtils';
import userEvent from '@testing-library/user-event';
import { HotelDetailsCard } from '@/components/admin/hotel-detail/HotelDetailsCard';

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

describe('HotelDetailsCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    description: 'A luxurious hotel in the heart of the city with excellent amenities and service.',
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
    it('renders the hotel details card with title', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Grand Hotel Details')).toBeInTheDocument();
    });

    it('renders about section with description', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('A luxurious hotel in the heart of the city with excellent amenities and service.')).toBeInTheDocument();
    });

    it('renders edit button with correct styling', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });
  });

  describe('Edit Button Functionality', () => {
    it('calls setEditModalState with correct parameters when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'details' });
    });

    it('calls setEditModalState only once when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'details');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'details' as const,
      };

      render(<HotelDetailsCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', async () => {
      const user = userEvent.setup();

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'details' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', async () => {
      const user = userEvent.setup();

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Optional Extras Section', () => {
    it('renders "What You Need to Know" section when hotel.optionalExtras contains items', () => {
      const hotelWithOptionalExtras = {
        ...mockHotel,
        optionalExtras: [
          {
            youNeedToKnow: 'Free breakfast included',
            weShouldMention: 'Available from 6 AM to 10 AM',
          },
          {
            youNeedToKnow: '24/7 front desk service',
            weShouldMention: 'Always available for assistance',
          },
          {
            youNeedToKnow: 'Free WiFi in all areas',
            weShouldMention: 'High-speed internet access',
          },
        ],
      };

      render(<HotelDetailsCard hotel={hotelWithOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
      expect(screen.getByTestId('optional-extras-section')).toBeInTheDocument();

      // Check first optional extra
      expect(screen.getByText('Free breakfast included')).toBeInTheDocument();
      expect(screen.getByText('Available from 6 AM to 10 AM')).toBeInTheDocument();

      // Check second optional extra
      expect(screen.getByText('24/7 front desk service')).toBeInTheDocument();
      expect(screen.getByText('Always available for assistance')).toBeInTheDocument();

      // Check third optional extra
      expect(screen.getByText('Free WiFi in all areas')).toBeInTheDocument();
      expect(screen.getByText('High-speed internet access')).toBeInTheDocument();
    });

    it('does not render "What You Need to Know" section when hotel.optionalExtras is empty', () => {
      const hotelWithEmptyOptionalExtras = {
        ...mockHotel,
        optionalExtras: [],
      };

      render(<HotelDetailsCard hotel={hotelWithEmptyOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByTestId('optional-extras-section')).not.toBeInTheDocument();
    });

    it('does not render "What You Need to Know" section when hotel.optionalExtras is null', () => {
      const hotelWithNullOptionalExtras = {
        ...mockHotel,
        optionalExtras: null,
      };

      render(<HotelDetailsCard hotel={hotelWithNullOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByTestId('optional-extras-section')).not.toBeInTheDocument();
    });

    it('does not render "What You Need to Know" section when hotel.optionalExtras is undefined', () => {
      const hotelWithUndefinedOptionalExtras = {
        ...mockHotel,
        optionalExtras: undefined,
      };

      render(<HotelDetailsCard hotel={hotelWithUndefinedOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByTestId('optional-extras-section')).not.toBeInTheDocument();
    });
  });

  describe('Languages Section', () => {
    it('renders "Languages Spoken" section with badges when hotel.languages contains values', () => {
      const hotelWithLanguages = {
        ...mockHotel,
        languages: ['English', 'Mongolian', 'Chinese', 'Russian'],
      };

      render(<HotelDetailsCard hotel={hotelWithLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Mongolian')).toBeInTheDocument();
      expect(screen.getByText('Chinese')).toBeInTheDocument();
      expect(screen.getByText('Russian')).toBeInTheDocument();
    });

    it('renders language badges with correct styling', () => {
      const hotelWithLanguages = {
        ...mockHotel,
        languages: ['English', 'Mongolian'],
      };

      render(<HotelDetailsCard hotel={hotelWithLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const englishBadge = screen.getByText('English');
      const mongolianBadge = screen.getByText('Mongolian');

      expect(englishBadge).toBeInTheDocument();
      expect(mongolianBadge).toBeInTheDocument();
    });

    it('does not render "Languages Spoken" section when hotel.languages is empty', () => {
      const hotelWithEmptyLanguages = {
        ...mockHotel,
        languages: [],
      };

      render(<HotelDetailsCard hotel={hotelWithEmptyLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
    });

    it('does not render "Languages Spoken" section when hotel.languages is null', () => {
      const hotelWithNullLanguages = {
        ...mockHotel,
        languages: null,
      };

      render(<HotelDetailsCard hotel={hotelWithNullLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
    });

    it('does not render "Languages Spoken" section when hotel.languages is undefined', () => {
      const hotelWithUndefinedLanguages = {
        ...mockHotel,
        languages: undefined,
      };

      render(<HotelDetailsCard hotel={hotelWithUndefinedLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('renders both optional extras and languages sections when both are available', () => {
      const hotelWithBoth = {
        ...mockHotel,
        optionalExtras: [
          {
            youNeedToKnow: 'Free breakfast included',
            weShouldMention: 'Available from 6 AM to 10 AM',
          },
        ],
        languages: ['English', 'Mongolian'],
      };

      render(<HotelDetailsCard hotel={hotelWithBoth} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
      expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
      expect(screen.getByText('Free breakfast included')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Mongolian')).toBeInTheDocument();
    });

    it('renders neither optional extras nor languages sections when both are missing', () => {
      const hotelWithNeither = {
        ...mockHotel,
        // optionalExtras and languages are not defined
      };

      render(<HotelDetailsCard hotel={hotelWithNeither} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
      expect(screen.queryByTestId('optional-extras-section')).not.toBeInTheDocument();
    });

    it('renders only optional extras section when languages is missing', () => {
      const hotelWithOnlyOptionalExtras = {
        ...mockHotel,
        optionalExtras: [
          {
            youNeedToKnow: 'Free breakfast included',
            weShouldMention: 'Available from 6 AM to 10 AM',
          },
        ],
        // languages is not defined
      };

      render(<HotelDetailsCard hotel={hotelWithOnlyOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
      expect(screen.getByText('Free breakfast included')).toBeInTheDocument();
    });

    it('renders only languages section when optional extras is missing', () => {
      const hotelWithOnlyLanguages = {
        ...mockHotel,
        // optionalExtras is not defined
        languages: ['English', 'Mongolian'],
      };

      render(<HotelDetailsCard hotel={hotelWithOnlyLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Mongolian')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('handles both edit button click and modal onOpenChange correctly', async () => {
      const user = userEvent.setup();

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'details' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'details' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'details');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('Grand Hotel Details')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('Grand Hotel Details')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('handles hotel with different data', () => {
      const differentHotel = {
        id: '2',
        name: 'Seaside Resort',
        description: 'A beautiful beachfront resort with stunning ocean views.',
        optionalExtras: [
          {
            youNeedToKnow: 'Beach access included',
            weShouldMention: 'Private beach area available',
          },
        ],
        languages: ['English', 'Spanish', 'French'],
      };

      render(<HotelDetailsCard hotel={differentHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Seaside Resort Details')).toBeInTheDocument();
      expect(screen.getByText('A beautiful beachfront resort with stunning ocean views.')).toBeInTheDocument();
      expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
      expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
      expect(screen.getByText('Beach access included')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
      expect(screen.getByText('French')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles hotel with missing optional fields gracefully', () => {
      const hotelWithMissingFields = {
        id: '3',
        name: 'Basic Hotel',
        description: 'A simple hotel.',
        // optionalExtras and languages are missing
      };

      render(<HotelDetailsCard hotel={hotelWithMissingFields} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Basic Hotel Details')).toBeInTheDocument();
      expect(screen.getByText('A simple hotel.')).toBeInTheDocument();
      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
      // Should not crash when optional fields are missing
    });

    it('handles hotel with empty string values', () => {
      const hotelWithEmptyStrings = {
        id: '4',
        name: 'Empty Hotel',
        description: '',
        optionalExtras: [],
        languages: [],
      };

      render(<HotelDetailsCard hotel={hotelWithEmptyStrings} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Empty Hotel Details')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
      expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
      // Should not crash with empty strings
    });
  });
});
