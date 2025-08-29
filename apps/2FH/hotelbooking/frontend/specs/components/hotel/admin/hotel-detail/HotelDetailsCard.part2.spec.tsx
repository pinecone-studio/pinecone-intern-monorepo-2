/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars, @typescript-eslint/no-var-requires, @next/next/no-img-element */
import React from 'react';
import { render, screen } from '@/TestUtils';
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

describe('HotelDetailsCard - Part 2', () => {
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

  it('renders hotel description correctly', () => {
    const hotelWithDescription = {
      ...mockHotel,
      description: 'A beautiful hotel with amazing amenities and great service',
    };

    render(<HotelDetailsCard hotel={hotelWithDescription} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('A beautiful hotel with amazing amenities and great service')).toBeInTheDocument();
  });

  it('renders languages section with badges correctly', () => {
    const hotelWithLanguages = {
      ...mockHotel,
      languages: ['English', 'Spanish', 'French', 'German'],
    };

    render(<HotelDetailsCard hotel={hotelWithLanguages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
  });

  it('renders single language correctly', () => {
    const hotelWithSingleLanguage = {
      ...mockHotel,
      languages: ['English'],
    };

    render(<HotelDetailsCard hotel={hotelWithSingleLanguage} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Languages Spoken')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });
});
