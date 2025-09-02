/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { HotelDetailsCard } from '@/components/admin/hotel-detail/HotelDetailsCard';

jest.mock('@/components/admin/hotel-detail/EditHotelModal', () => ({
  EditHotelModal: function MockEditHotelModal({ hotel: _hotel, section, isOpen, onOpenChange: _onOpenChange, refetch: _refetch, hotelId: _hotelId }: any) {
    return (
      <div data-testid="edit-hotel-modal" data-section={section} data-is-open={isOpen}>
        Mock EditHotelModal
      </div>
    );
  },
}));

describe('HotelDetailsCard - Part 1', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    description: 'A test hotel',
    city: 'Test City',
    country: 'Test Country',
    location: 'Test Location',
    phone: '123-456-7890',
    stars: 4,
    rating: 4.5,
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
  it('renders hotel details card with title', () => {
    render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Test Hotel Details')).toBeInTheDocument();
  });

  it('renders about section with description', () => {
    render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('A test hotel')).toBeInTheDocument();
  });

  it('renders optional extras section when available', () => {
    const hotelWithOptionalExtras = {
      ...mockHotel,
      optionalExtras: [
        { weShouldMention: 'Free breakfast included', youNeedToKnow: 'Available from 6 AM to 10 AM' },
        { weShouldMention: '24/7 front desk service', youNeedToKnow: 'Always available for assistance' },
      ],
    };

    render(<HotelDetailsCard hotel={hotelWithOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
    expect(screen.getByText('Free breakfast included')).toBeInTheDocument();
    expect(screen.getByText('24/7 front desk service')).toBeInTheDocument();
  });

  it('renders languages section when available', () => {
    const hotelWithLanguages = {
      ...mockHotel,
      languages: ['English', 'Spanish', 'French'],
    };

    render(<HotelDetailsCard hotel={hotelWithLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('renders edit button', () => {
    render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    // The Button component doesn't pass size as an attribute, so check for styling classes instead
    expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'details' });
  });

  it('renders EditHotelModal with correct props', () => {
    render(<HotelDetailsCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editModal = screen.getByTestId('edit-hotel-modal');
    expect(editModal).toBeInTheDocument();
    expect(editModal).toHaveAttribute('data-section', 'details');
    expect(editModal).toHaveAttribute('data-is-open', 'false');
  });

  it('does not render optional extras section when not available', () => {
    const hotelWithoutOptionalExtras = {
      ...mockHotel,
      optionalExtras: [],
    };

    render(<HotelDetailsCard hotel={hotelWithoutOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
  });

  it('does not render optional extras section when property is missing', () => {
    const hotelWithoutOptionalExtrasProperty = {
      id: '1',
      name: 'Test Hotel',
      description: 'A beautiful test hotel',
      languages: ['English'],
    };

    render(<HotelDetailsCard hotel={hotelWithoutOptionalExtrasProperty} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
  });

  it('does not render languages section when not available', () => {
    const hotelWithoutLanguages = {
      ...mockHotel,
      languages: [],
    };

    render(<HotelDetailsCard hotel={hotelWithoutLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
  });

  it('does not render languages section when property is missing', () => {
    const hotelWithoutLanguagesProperty = {
      id: '1',
      name: 'Test Hotel',
      description: 'A beautiful test hotel',
      optionalExtras: [],
    };

    render(<HotelDetailsCard hotel={hotelWithoutLanguagesProperty} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
  });

  it('does not render optional extras section when property is null', () => {
    const hotelWithNullOptionalExtras = {
      ...mockHotel,
      optionalExtras: null,
    };

    render(<HotelDetailsCard hotel={hotelWithNullOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
  });

  it('does not render optional extras section when property is undefined', () => {
    const hotelWithUndefinedOptionalExtras = {
      ...mockHotel,
      optionalExtras: undefined,
    };

    render(<HotelDetailsCard hotel={hotelWithUndefinedOptionalExtras} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
  });

  it('does not render languages section when property is null', () => {
    const hotelWithNullLanguages = {
      ...mockHotel,
      languages: null,
    };

    render(<HotelDetailsCard hotel={hotelWithNullLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
  });

  it('does not render languages section when property is undefined', () => {
    const hotelWithUndefinedLanguages = {
      ...mockHotel,
      languages: undefined,
    };

    render(<HotelDetailsCard hotel={hotelWithUndefinedLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.queryByText('Languages Spoken')).not.toBeInTheDocument();
  });
});
