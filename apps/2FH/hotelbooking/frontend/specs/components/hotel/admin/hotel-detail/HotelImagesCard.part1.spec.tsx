import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { HotelImagesCard } from '@/components/admin/hotel-detail/HotelImagesCard';

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, fill: _fill, className }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="next-image" />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});
jest.mock('@/components/admin/hotel-detail/EditHotelModal', () => ({
  EditHotelModal: function MockEditHotelModal({ section, isOpen }: any) {
    return (
      <div data-testid="edit-hotel-modal" data-section={section} data-is-open={isOpen}>
        Mock EditHotelModal
      </div>
    );
  },
}));

// Import the component after mocking

describe('HotelImagesCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
  };

  const mockEditModalState = {
    isOpen: false,
    section: 'images' as const,
  };

  const mockSetEditModalState = jest.fn();
  const mockRefetch = jest.fn();
  const mockHotelId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders hotel images card with title', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
  });

  it('renders all hotel images', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const images = screen.getAllByTestId('next-image');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
    expect(images[2]).toHaveAttribute('src', 'https://example.com/image3.jpg');
  });

  it('renders image labels correctly', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('Image 1')).toBeInTheDocument();
    expect(screen.getByText('Image 2')).toBeInTheDocument();
    expect(screen.getByText('Image 3')).toBeInTheDocument();
  });

  it('renders edit button', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    // The Button component might not pass the size attribute through to the DOM
    // Instead, we can check that the button has the correct styling classes
    expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
  });

  it('renders EditHotelModal with correct props', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const editModal = screen.getByTestId('edit-hotel-modal');
    expect(editModal).toBeInTheDocument();
    expect(editModal).toHaveAttribute('data-section', 'images');
    expect(editModal).toHaveAttribute('data-is-open', 'false');
  });

  it('renders images grid with correct data-testid', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByTestId('images-grid')).toBeInTheDocument();
  });

  it('opens edit modal when remove button is clicked', () => {
    render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
  });

  it('displays no images message when no images available', () => {
    const hotelWithoutImages = { ...mockHotel, images: [] };
    render(<HotelImagesCard hotel={hotelWithoutImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('displays no images message when images property is missing', () => {
    const hotelWithoutImagesProperty = { ...mockHotel };
    delete hotelWithoutImagesProperty.images;
    render(<HotelImagesCard hotel={hotelWithoutImagesProperty} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('displays no images message when images property is null', () => {
    const hotelWithNullImages = { ...mockHotel, images: null };
    render(<HotelImagesCard hotel={hotelWithNullImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('displays no images message when images property is undefined', () => {
    const hotelWithUndefinedImages = { ...mockHotel, images: undefined };
    render(<HotelImagesCard hotel={hotelWithUndefinedImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

    expect(screen.getByText('No images available')).toBeInTheDocument();
  });
});
