/* eslint-disable  */
import React from 'react';
import { render, screen } from '@/TestUtils';
import userEvent from '@testing-library/user-event';
import { FAQCard } from '@/components/admin/hotel-detail/FaqCard';

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

describe('FAQCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    faq: [
      {
        question: 'What time is check-in?',
        answer: 'Check-in is available from 2:00 PM onwards.',
      },
      {
        question: 'What time is check-out?',
        answer: 'Check-out is until 11:00 AM.',
      },
      {
        question: 'Do you offer free WiFi?',
        answer: 'Yes, complimentary high-speed WiFi is available throughout the hotel.',
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
    it('renders the FAQ card with title', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('renders all FAQ items with questions and answers', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Check first FAQ item
      expect(screen.getByText('What time is check-in?')).toBeInTheDocument();
      expect(screen.getByText('Check-in is available from 2:00 PM onwards.')).toBeInTheDocument();

      // Check second FAQ item
      expect(screen.getByText('What time is check-out?')).toBeInTheDocument();
      expect(screen.getByText('Check-out is until 11:00 AM.')).toBeInTheDocument();

      // Check third FAQ item
      expect(screen.getByText('Do you offer free WiFi?')).toBeInTheDocument();
      expect(screen.getByText('Yes, complimentary high-speed WiFi is available throughout the hotel.')).toBeInTheDocument();
    });

    it('renders edit button with correct styling', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });
  });

  describe('Edit Button Functionality', () => {
    it('calls setEditModalState with correct parameters when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'faq' });
    });

    it('calls setEditModalState only once when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'faq');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'faq' as const,
      };

      render(<FAQCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', async () => {
      const user = userEvent.setup();

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'faq' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', async () => {
      const user = userEvent.setup();

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('FAQ Rendering', () => {
    it('renders single FAQ item correctly', () => {
      const hotelWithSingleFaq = {
        ...mockHotel,
        faq: [
          {
            question: 'What is your cancellation policy?',
            answer: 'Free cancellation up to 24 hours before check-in.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithSingleFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What is your cancellation policy?')).toBeInTheDocument();
      expect(screen.getByText('Free cancellation up to 24 hours before check-in.')).toBeInTheDocument();
    });

    it('renders multiple FAQ items with proper spacing', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // All questions should be present
      expect(screen.getByText('What time is check-in?')).toBeInTheDocument();
      expect(screen.getByText('What time is check-out?')).toBeInTheDocument();
      expect(screen.getByText('Do you offer free WiFi?')).toBeInTheDocument();

      // All answers should be present
      expect(screen.getByText('Check-in is available from 2:00 PM onwards.')).toBeInTheDocument();
      expect(screen.getByText('Check-out is until 11:00 AM.')).toBeInTheDocument();
      expect(screen.getByText('Yes, complimentary high-speed WiFi is available throughout the hotel.')).toBeInTheDocument();
    });

    it('renders FAQ items with different content types', () => {
      const hotelWithVariedFaq = {
        ...mockHotel,
        faq: [
          {
            question: 'Short question?',
            answer: 'Short answer.',
          },
          {
            question: 'Very long question that spans multiple words and contains detailed information about the hotel services and amenities?',
            answer: 'Very long answer that provides comprehensive information about the hotel policies, services, amenities, and other important details that guests need to know before their stay.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithVariedFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Short question?')).toBeInTheDocument();
      expect(screen.getByText('Short answer.')).toBeInTheDocument();
      expect(screen.getByText('Very long question that spans multiple words and contains detailed information about the hotel services and amenities?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Very long answer that provides comprehensive information about the hotel policies, services, amenities, and other important details that guests need to know before their stay.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering - Empty FAQ', () => {
    it('returns null when hotel.faq is empty array', () => {
      const hotelWithEmptyFaq = {
        ...mockHotel,
        faq: [],
      };

      const { container } = render(<FAQCard hotel={hotelWithEmptyFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('returns null when hotel.faq is null', () => {
      const hotelWithNullFaq = {
        ...mockHotel,
        faq: null,
      };

      const { container } = render(<FAQCard hotel={hotelWithNullFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('returns null when hotel.faq is undefined', () => {
      const hotelWithUndefinedFaq = {
        ...mockHotel,
        faq: undefined,
      };

      const { container } = render(<FAQCard hotel={hotelWithUndefinedFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('returns null when hotel.faq property does not exist', () => {
      const hotelWithoutFaqProperty = {
        id: '1',
        name: 'Grand Hotel',
        // faq property is missing
      };

      const { container } = render(
        <FAQCard hotel={hotelWithoutFaqProperty} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('handles both edit button click and modal onOpenChange correctly', async () => {
      const user = userEvent.setup();

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      await user.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'faq' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'faq' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'faq');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByText('What time is check-in?')).toBeInTheDocument();
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('handles hotel with different FAQ data', () => {
      const differentHotel = {
        id: '2',
        name: 'Seaside Resort',
        faq: [
          {
            question: 'Do you have a pool?',
            answer: 'Yes, we have both indoor and outdoor pools.',
          },
          {
            question: 'Is parking available?',
            answer: 'Free parking is available for all guests.',
          },
        ],
      };

      render(<FAQCard hotel={differentHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('Do you have a pool?')).toBeInTheDocument();
      expect(screen.getByText('Yes, we have both indoor and outdoor pools.')).toBeInTheDocument();
      expect(screen.getByText('Is parking available?')).toBeInTheDocument();
      expect(screen.getByText('Free parking is available for all guests.')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles FAQ items with empty strings', () => {
      const hotelWithEmptyStrings = {
        ...mockHotel,
        faq: [
          {
            question: '',
            answer: '',
          },
          {
            question: 'Valid question?',
            answer: 'Valid answer.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithEmptyStrings} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Should render the valid FAQ item
      expect(screen.getByText('Valid question?')).toBeInTheDocument();
      expect(screen.getByText('Valid answer.')).toBeInTheDocument();

      // Should not crash with empty strings
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('handles FAQ items with special characters', () => {
      const hotelWithSpecialChars = {
        ...mockHotel,
        faq: [
          {
            question: 'What\'s included in the "All-Inclusive" package?',
            answer: 'The package includes: meals, drinks, activities, & entertainment!',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithSpecialChars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What\'s included in the "All-Inclusive" package?')).toBeInTheDocument();
      expect(screen.getByText('The package includes: meals, drinks, activities, & entertainment!')).toBeInTheDocument();
    });

    it('handles very long FAQ content', () => {
      const hotelWithLongContent = {
        ...mockHotel,
        faq: [
          {
            question:
              'This is a very long question that contains many words and detailed information about the hotel services, amenities, policies, and other important aspects that guests might want to know about before making a reservation or during their stay.',
            answer:
              'This is a very long answer that provides comprehensive information about the hotel policies, services, amenities, facilities, staff, location, transportation options, nearby attractions, dining options, room types, pricing, cancellation policies, check-in procedures, check-out procedures, and other important details that guests need to know before their stay.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithLongContent} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(
        screen.getByText(
          'This is a very long question that contains many words and detailed information about the hotel services, amenities, policies, and other important aspects that guests might want to know about before making a reservation or during their stay.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'This is a very long answer that provides comprehensive information about the hotel policies, services, amenities, facilities, staff, location, transportation options, nearby attractions, dining options, room types, pricing, cancellation policies, check-in procedures, check-out procedures, and other important details that guests need to know before their stay.'
        )
      ).toBeInTheDocument();
    });
  });
});
