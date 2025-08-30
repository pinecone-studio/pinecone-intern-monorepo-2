/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { PoliciesCard } from '@/components/admin/hotel-detail/PoliciesCard';

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
  Clock: ({ size, className }: any) => (
    <div data-testid="clock-icon" data-size={size} className={className}>
      🕐
    </div>
  ),
  Users: ({ size, className }: any) => (
    <div data-testid="users-icon" data-size={size} className={className}>
      👥
    </div>
  ),
  PawPrint: ({ size, className }: any) => (
    <div data-testid="paw-print-icon" data-size={size} className={className}>
      🐾
    </div>
  ),
}));

describe('PoliciesCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    policies: [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'Pets not allowed',
        specialCheckInInstructions: 'Please present valid ID at check-in',
        accessMethods: ['Key card'],
      },
      {
        checkIn: '15:00',
        checkOut: '12:00',
        childrenAndExtraBeds: 'Children under 10 stay free',
        pets: 'Pets allowed with additional fee',
        specialCheckInInstructions: 'Early check-in available upon request',
        accessMethods: ['Key card', 'Mobile app'],
      },
    ],
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
    it('renders the policies card with title', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Policies')).toBeInTheDocument();
    });

    it('renders all policy information correctly', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Check first policy
      expect(screen.getByText('Check-in: 14:00')).toBeInTheDocument();
      expect(screen.getByText('Check-out: 11:00')).toBeInTheDocument();
      expect(screen.getByText('Children under 12 stay free')).toBeInTheDocument();
      expect(screen.getByText('Pets not allowed')).toBeInTheDocument();
      expect(screen.getAllByText('Special Check-in Instructions:')).toHaveLength(2);
      expect(screen.getByText('Please present valid ID at check-in')).toBeInTheDocument();

      // Check second policy
      expect(screen.getByText('Check-in: 15:00')).toBeInTheDocument();
      expect(screen.getByText('Check-out: 12:00')).toBeInTheDocument();
      expect(screen.getByText('Children under 10 stay free')).toBeInTheDocument();
      expect(screen.getByText('Pets allowed with additional fee')).toBeInTheDocument();
      expect(screen.getByText('Early check-in available upon request')).toBeInTheDocument();
    });

    it('renders policy items with correct data-testid attributes', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('policy-0')).toBeInTheDocument();
      expect(screen.getByTestId('policy-1')).toBeInTheDocument();
    });

    it('renders icons correctly', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const clockIcons = screen.getAllByTestId('clock-icon');
      const usersIcons = screen.getAllByTestId('users-icon');
      const pawPrintIcons = screen.getAllByTestId('paw-print-icon');

      expect(clockIcons.length).toBeGreaterThan(0);
      expect(usersIcons.length).toBeGreaterThan(0);
      expect(pawPrintIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Edit Button Functionality', () => {
    it('renders edit button with correct styling', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('calls setEditModalState with correct parameters when edit button is clicked', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'policies' });
    });

    it('calls setEditModalState only once when edit button is clicked', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'policies');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'policies' as const,
      };

      render(<PoliciesCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'policies' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('returns null when hotel has no policies', () => {
      const hotelWithoutPolicies = {
        ...mockHotel,
        policies: [],
      };

      const { container } = render(
        <PoliciesCard hotel={hotelWithoutPolicies} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel policies is null', () => {
      const hotelWithNullPolicies = {
        ...mockHotel,
        policies: null,
      };

      const { container } = render(
        <PoliciesCard hotel={hotelWithNullPolicies} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel policies is undefined', () => {
      const hotelWithUndefinedPolicies = {
        ...mockHotel,
        policies: undefined,
      };

      const { container } = render(
        <PoliciesCard hotel={hotelWithUndefinedPolicies} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('handles policy with missing fields gracefully', () => {
      const hotelWithIncompletePolicy = {
        ...mockHotel,
        policies: [
          {
            checkIn: '14:00',
            checkOut: '11:00',
            // Missing other fields
          },
        ],
      };

      render(<PoliciesCard hotel={hotelWithIncompletePolicy} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Check-in: 14:00')).toBeInTheDocument();
      expect(screen.getByText('Check-out: 11:00')).toBeInTheDocument();
      // Should not crash when fields are missing
    });
  });

  describe('Integration Tests', () => {
    it('handles both edit button click and modal onOpenChange correctly', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'policies' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'policies' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'policies');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('Policies')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<PoliciesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('Policies')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });
});
