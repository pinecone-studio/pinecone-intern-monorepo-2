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

  describe('HotelImagesCard - Part 2', () => {
    it('handles hotel with single image', () => {
      const hotelWithSingleImage = { ...mockHotel, images: ['https://example.com/single-image.jpg'] };
      render(<HotelImagesCard hotel={hotelWithSingleImage} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/single-image.jpg');
    });

    it('renders images with correct alt text', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      expect(images[0]).toHaveAttribute('alt', 'Test Hotel - Image 1');
      expect(images[1]).toHaveAttribute('alt', 'Test Hotel - Image 2');
      expect(images[2]).toHaveAttribute('alt', 'Test Hotel - Image 3');
    });

    it('renders images with correct CSS classes', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      images.forEach((image) => {
        expect(image).toHaveClass('object-cover');
      });
    });

    it('renders remove buttons with correct styling', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');
      removeButtons.forEach((button) => {
        expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700');
      });
    });

    it('handles hotel with many images', () => {
      const hotelWithManyImages = {
        ...mockHotel,
        images: Array.from({ length: 10 }, (_, i) => `https://example.com/image${i + 1}.jpg`),
      };
      render(<HotelImagesCard hotel={hotelWithManyImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(10);
    });

    it('handles hotel with special characters in name', () => {
      const hotelWithSpecialChars = { ...mockHotel, name: 'Hotel & Resort (Special)' };
      render(<HotelImagesCard hotel={hotelWithSpecialChars} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      expect(images[0]).toHaveAttribute('alt', 'Hotel & Resort (Special) - Image 1');
    });

    it('renders edit button with correct styling', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('renders EditHotelModal as open when editModalState.isOpen is true', () => {
      const openEditModalState = { ...mockEditModalState, isOpen: true };
      render(<HotelImagesCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('handles multiple remove button clicks', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');

      // Click first remove button
      fireEvent.click(removeButtons[0]);
      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });

      // Click second remove button
      fireEvent.click(removeButtons[1]);
      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });

      expect(mockSetEditModalState).toHaveBeenCalledTimes(2);
    });

    it('renders image containers with correct structure', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const imageContainers = screen.getAllByText(/Image \d+/);
      expect(imageContainers).toHaveLength(3);

      imageContainers.forEach((container) => {
        expect(container).toHaveClass('text-xs', 'text-gray-500', 'mt-1', 'text-center');
      });
    });
  });
});
