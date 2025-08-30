/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { HotelImagesCard } from '@/components/admin/hotel-detail/HotelImagesCard';

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, fill: _fill, className }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="next-image" />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

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

describe('HotelImagesCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Grand Hotel',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg', 'https://example.com/image4.jpg'],
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
    it('renders the hotel images card with title', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
    });

    it('renders all hotel images correctly', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(4);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
      expect(images[2]).toHaveAttribute('src', 'https://example.com/image3.jpg');
      expect(images[3]).toHaveAttribute('src', 'https://example.com/image4.jpg');
    });

    it('renders image labels correctly', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.getByText('Image 2')).toBeInTheDocument();
      expect(screen.getByText('Image 3')).toBeInTheDocument();
      expect(screen.getByText('Image 4')).toBeInTheDocument();
    });

    it('renders images grid with correct data-testid', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByTestId('images-grid')).toBeInTheDocument();
    });

    it('renders hotel image containers with correct data-testid', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const imageContainers = screen.getAllByTestId('hotel-image');
      expect(imageContainers).toHaveLength(4);
    });
  });

  describe('Edit Button Functionality', () => {
    it('renders edit button with correct styling', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    });

    it('calls setEditModalState with correct parameters when edit button is clicked', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
    });

    it('calls setEditModalState only once when edit button is clicked', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('EditHotelModal Integration', () => {
    it('renders EditHotelModal with correct props', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'images');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });

    it('renders EditHotelModal as open when editModalState indicates it should be open', () => {
      const openEditModalState = {
        isOpen: true,
        section: 'images' as const,
      };

      render(<HotelImagesCard hotel={mockHotel} editModalState={openEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toHaveAttribute('data-is-open', 'true');
    });

    it('calls setEditModalState with correct parameters when EditHotelModal onOpenChange is triggered', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
    });

    it('calls setEditModalState only once when EditHotelModal onOpenChange is triggered', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Remove Button Functionality', () => {
    it('renders remove buttons for each image', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons).toHaveLength(4);
    });

    it('calls setEditModalState with correct parameters when remove button is clicked', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
    });

    it('calls setEditModalState with correct parameters when any remove button is clicked', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');

      // Click the second remove button
      fireEvent.click(removeButtons[1]);
      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });

      // Reset mock and click the third remove button
      mockSetEditModalState.mockClear();
      fireEvent.click(removeButtons[2]);
      expect(mockSetEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
    });

    it('calls setEditModalState only once when remove button is clicked', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty Images State', () => {
    it('renders "No images available" message when hotel.images is empty', () => {
      const hotelWithNoImages = {
        ...mockHotel,
        images: [],
      };

      render(<HotelImagesCard hotel={hotelWithNoImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('No images available')).toBeInTheDocument();
      expect(screen.queryByTestId('images-grid')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-image')).not.toBeInTheDocument();
    });

    it('renders "No images available" message when hotel.images is null', () => {
      const hotelWithNullImages = {
        ...mockHotel,
        images: null,
      };

      render(<HotelImagesCard hotel={hotelWithNullImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('No images available')).toBeInTheDocument();
      expect(screen.queryByTestId('images-grid')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-image')).not.toBeInTheDocument();
    });

    it('renders "No images available" message when hotel.images is undefined', () => {
      const hotelWithUndefinedImages = {
        ...mockHotel,
        images: undefined,
      };

      render(<HotelImagesCard hotel={hotelWithUndefinedImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('No images available')).toBeInTheDocument();
      expect(screen.queryByTestId('images-grid')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-image')).not.toBeInTheDocument();
    });

    it('still renders edit button when no images are available', () => {
      const hotelWithNoImages = {
        ...mockHotel,
        images: [],
      };

      render(<HotelImagesCard hotel={hotelWithNoImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('handles multiple interactions correctly', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Click edit button
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      // Click modal to trigger onOpenChange
      const editModal = screen.getByTestId('edit-hotel-modal');
      fireEvent.click(editModal);

      // Click a remove button
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      expect(mockSetEditModalState).toHaveBeenCalledTimes(3);
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(1, { isOpen: true, section: 'images' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(2, { isOpen: true, section: 'images' });
      expect(mockSetEditModalState).toHaveBeenNthCalledWith(3, { isOpen: true, section: 'images' });
    });

    it('passes correct props to EditHotelModal', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      const editModal = screen.getByTestId('edit-hotel-modal');
      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveAttribute('data-section', 'images');
      expect(editModal).toHaveAttribute('data-is-open', 'false');
    });
  });

  describe('Props Validation', () => {
    it('receives and uses all required props correctly', () => {
      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      // Verify that the component renders with all props
      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByTestId('images-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('hotel-image')).toHaveLength(4);
    });

    it('handles different hotelId values correctly', () => {
      const differentHotelId = 'different-hotel-id';

      render(<HotelImagesCard hotel={mockHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={differentHotelId} />);

      // Component should render correctly regardless of hotelId
      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('handles hotel with different image data', () => {
      const differentHotel = {
        id: '2',
        name: 'Seaside Resort',
        images: ['https://example.com/beach1.jpg', 'https://example.com/beach2.jpg'],
      };

      render(<HotelImagesCard hotel={differentHotel} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Hotel Images')).toBeInTheDocument();
      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.getByText('Image 2')).toBeInTheDocument();

      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/beach1.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/beach2.jpg');
    });
  });

  describe('Edge Cases', () => {
    it('handles hotel with missing images property gracefully', () => {
      const hotelWithMissingImages = {
        id: '3',
        name: 'Basic Hotel',
        // images property is missing
      };

      render(<HotelImagesCard hotel={hotelWithMissingImages} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('No images available')).toBeInTheDocument();
      // Should not crash when images property is missing
    });

    it('handles hotel with single image', () => {
      const hotelWithSingleImage = {
        id: '4',
        name: 'Single Image Hotel',
        images: ['https://example.com/single.jpg'],
      };

      render(<HotelImagesCard hotel={hotelWithSingleImage} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId={mockHotelId} />);

      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.queryByText('Image 2')).not.toBeInTheDocument();

      const images = screen.getAllByTestId('next-image');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/single.jpg');
    });
  });
});
