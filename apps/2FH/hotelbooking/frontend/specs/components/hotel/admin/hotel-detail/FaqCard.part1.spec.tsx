import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
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

describe('FaqCard - Part 1', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    faq: [
      { question: 'What time is check-in?', answer: 'Check-in is available from 2:00 PM' },
      { question: 'What time is check-out?', answer: 'Check-out is until 11:00 AM' },
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

  it('renders FAQ card with title', () => {
    render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('What time is check-in?')).toBeInTheDocument();
    expect(screen.getByText('Check-in is available from 2:00 PM')).toBeInTheDocument();
    expect(screen.getByText('What time is check-out?')).toBeInTheDocument();
    expect(screen.getByText('Check-out is until 11:00 AM')).toBeInTheDocument();
  });

  it('renders edit button', () => {
    render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    // The Button component doesn't pass size as an attribute, so check for styling classes instead
    expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'faq' });
  });

  it('renders EditHotelModal with correct props', () => {
    render(<FAQCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editModal = screen.getByTestId('edit-hotel-modal');
    expect(editModal).toBeInTheDocument();
    expect(editModal).toHaveAttribute('data-section', 'faq');
    expect(editModal).toHaveAttribute('data-is-open', 'false');
  });

  it('renders EditHotelModal as open when editModalState.isOpen is true', () => {
    const openEditModalState = {
      isOpen: true,
      section: 'faq' as const,
    };

    render(<FAQCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editModal = screen.getByTestId('edit-hotel-modal');
    expect(editModal).toHaveAttribute('data-is-open', 'true');
  });

  it('returns null when hotel has no FAQ', () => {
    const hotelWithoutFaq = {
      ...mockHotel,
      faq: [],
    };

    const { container } = render(<FAQCard hotel={hotelWithoutFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has no FAQ property', () => {
    const hotelWithoutFaqProperty = {
      id: '1',
      name: 'Test Hotel',
    };

    const { container } = render(<FAQCard hotel={hotelWithoutFaqProperty} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has null FAQ', () => {
    const hotelWithNullFaq = {
      ...mockHotel,
      faq: null,
    };

    const { container } = render(<FAQCard hotel={hotelWithNullFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has undefined FAQ', () => {
    const hotelWithUndefinedFaq = {
      ...mockHotel,
      faq: undefined,
    };

    const { container } = render(<FAQCard hotel={hotelWithUndefinedFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has falsy FAQ', () => {
    const hotelWithFalsyFaq = {
      ...mockHotel,
      faq: false,
    };

    const { container } = render(<FAQCard hotel={hotelWithFalsyFaq} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(container.firstChild).toBeNull();
  });
});
