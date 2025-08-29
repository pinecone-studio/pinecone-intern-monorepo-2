import React from 'react';
import { render, screen } from '@/TestUtils';
import { FAQCard } from '@/components/admin/hotel-detail/FaqCard';

jest.mock('@/components/admin/hotel-detail/EditHotelModal', () => ({
  EditHotelModal: function MockEditHotelModal({ hotel: _hotel, section, isOpen, onOpenChange: _onOpenChange, refetch: _refetch, hotelId: _hotelId }: any) {
    return (
      <div data-testid="edit-hotel-modal" data-section={section} data-is-open={isOpen}>
        Mock EditHotelModal
      </div>
    );
  },
}));

describe('FAQCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    faq: [
      {
        question: 'What time is check-in?',
        answer: 'Check-in is available from 2:00 PM',
      },
      {
        question: 'What time is check-out?',
        answer: 'Check-out is until 11:00 AM',
      },
    ],
  };

  const mockEditModalState = {
    isOpen: false,
    section: 'faq' as const,
  };

  const mockSetEditModalState = jest.fn();
  const mockRefetch = jest.fn();
  const mockHotelId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FaqCard - Part 2', () => {
    it('renders FAQ items with correct styling', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const faqItems = screen.getAllByText(/What time is/);
      expect(faqItems).toHaveLength(2);
    });

    it('handles single FAQ item', () => {
      const hotelWithSingleFaq = {
        ...mockHotel,
        faq: [
          {
            question: 'Single question?',
            answer: 'Single answer.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithSingleFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Single question?')).toBeInTheDocument();
      expect(screen.getByText('Single answer.')).toBeInTheDocument();
    });

    it('handles FAQ with special characters', () => {
      const hotelWithSpecialChars = {
        ...mockHotel,
        faq: [
          {
            question: 'What about & special characters?',
            answer: 'They work fine! 🎉',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithSpecialChars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('What about & special characters?')).toBeInTheDocument();
      expect(screen.getByText('They work fine! 🎉')).toBeInTheDocument();
    });

    it('handles FAQ with long text', () => {
      const hotelWithLongText = {
        ...mockHotel,
        faq: [
          {
            question: 'This is a very long question that might wrap to multiple lines and should still be displayed correctly in the FAQ card component?',
            answer:
              'This is a very long answer that might also wrap to multiple lines and should still be displayed correctly in the FAQ card component. It could contain a lot of information about the hotel policies, amenities, or other important details that guests need to know.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithLongText} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText(/This is a very long question/)).toBeInTheDocument();
      expect(screen.getByText(/This is a very long answer/)).toBeInTheDocument();
    });

    it('handles FAQ with HTML-like content', () => {
      const hotelWithHtmlContent = {
        ...mockHotel,
        faq: [
          {
            question: 'Question with <strong>HTML</strong>?',
            answer: 'Answer with <em>HTML</em> content.',
          },
        ],
      };

      render(<FAQCard hotel={hotelWithHtmlContent} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Question with <strong>HTML</strong>?')).toBeInTheDocument();
      expect(screen.getByText('Answer with <em>HTML</em> content.')).toBeInTheDocument();
    });

    it('renders edit button with correct styling', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('passes correct props to EditHotelModal', () => {
      render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
    });
  });
});
