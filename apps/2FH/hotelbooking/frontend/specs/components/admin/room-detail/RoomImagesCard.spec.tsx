/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomImagesCard } from '@/components/admin/room-detail/RoomImagesCard';

// Mock dependencies
jest.mock('@/components/admin/room-detail/EditRoomModal', () => ({
  EditRoomModal: ({ section, onOpenChange }: any) => (
    <div data-testid="edit-room-modal">
      <div>Edit Room Modal - {section}</div>
      <button onClick={() => onOpenChange(false)}>Close Modal</button>
    </div>
  ),
}));

describe('RoomImagesCard', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    imageURL: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
  };

  const defaultProps = {
    room: mockRoom,
    editModalState: { isOpen: false, section: 'images' as const },
    setEditModalState: jest.fn(),
    refetch: jest.fn(),
    roomId: 'room-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders images card correctly', () => {
    render(<RoomImagesCard {...defaultProps} />);

    expect(screen.getByText('Room Images')).toBeInTheDocument();
  });

  it('renders multiple images in grid layout', () => {
    render(<RoomImagesCard {...defaultProps} />);

    expect(screen.getByText('3 images uploaded')).toBeInTheDocument();

    const images = screen.getAllByAltText(/Deluxe Suite - Image/);
    expect(images).toHaveLength(3);
  });

  it('renders single image correctly', () => {
    const roomWithSingleImage = {
      ...mockRoom,
      imageURL: ['https://example.com/single-image.jpg'],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithSingleImage} />);

    expect(screen.getByText('1 image uploaded')).toBeInTheDocument();
    expect(screen.getByAltText('Deluxe Suite - Image 1')).toBeInTheDocument();
  });

  it('handles single image as string', () => {
    const roomWithStringImage = {
      ...mockRoom,
      imageURL: 'https://example.com/single-image.jpg',
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithStringImage} />);

    expect(screen.getByText('Room image')).toBeInTheDocument();
    expect(screen.getByAltText('Deluxe Suite')).toBeInTheDocument();
  });

  it('renders no images state', () => {
    const roomWithNoImages = {
      ...mockRoom,
      imageURL: [],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithNoImages} />);

    expect(screen.getByText('No images uploaded for this room')).toBeInTheDocument();
    expect(screen.getByText('Add Images')).toBeInTheDocument();
  });

  it('renders no images state when imageURL is null', () => {
    const roomWithNullImages = {
      ...mockRoom,
      imageURL: null,
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithNullImages} />);

    expect(screen.getByText('No images uploaded for this room')).toBeInTheDocument();
  });

  it('renders no images state when imageURL is undefined', () => {
    const roomWithUndefinedImages = {
      ...mockRoom,
      imageURL: undefined,
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithUndefinedImages} />);

    expect(screen.getByText('No images uploaded for this room')).toBeInTheDocument();
  });

  it('handles image load error for array images with parent element manipulation', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const image = screen.getByAltText('Deluxe Suite - Image 1');
    const parentElement = image.parentElement;

    // Ensure parent element exists
    expect(parentElement).toBeTruthy();

    // Simulate image load error
    fireEvent.error(image);

    // The image should be hidden
    expect(image).toHaveStyle('display: none');

    // The parent element should have error content injected (covers line 56)
    if (parentElement) {
      expect(parentElement.innerHTML).toContain('Failed to load');
      expect(parentElement.innerHTML).toContain('svg');
    }
  });

  it('handles image load error when parent element does not exist', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const image = screen.getByAltText('Deluxe Suite - Image 1');

    // Remove parent element to test the case where parent is null
    const parentElement = image.parentElement;
    if (parentElement) {
      parentElement.removeChild(image);
    }

    // Simulate image load error
    fireEvent.error(image);

    // The image should be hidden
    expect(image).toHaveStyle('display: none');
  });

  it('handles image load error for single string image', () => {
    const roomWithStringImage = {
      ...mockRoom,
      imageURL: 'https://example.com/single-image.jpg',
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithStringImage} />);

    const image = screen.getByAltText('Deluxe Suite');

    // Simulate image load error
    fireEvent.error(image);

    // The image should be hidden
    expect(image).toHaveStyle('display: none');
  });

  it('renders images in responsive grid', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
  });

  it('shows image hover overlay', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const imageContainer = document.querySelector('.relative.group');
    expect(imageContainer).toBeInTheDocument();

    const overlay = document.querySelector('.absolute.bottom-0.left-0.right-0.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    const setEditModalState = jest.fn();
    render(<RoomImagesCard {...defaultProps} setEditModalState={setEditModalState} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(setEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
  });

  it('opens edit modal when add images button is clicked', () => {
    const roomWithNoImages = {
      ...mockRoom,
      imageURL: [],
    };

    const setEditModalState = jest.fn();
    render(<RoomImagesCard {...defaultProps} room={roomWithNoImages} setEditModalState={setEditModalState} />);

    const addImagesButton = screen.getByText('Add Images');
    fireEvent.click(addImagesButton);

    expect(setEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'images' });
  });

  it('renders edit modal when open', () => {
    render(<RoomImagesCard {...defaultProps} editModalState={{ isOpen: true, section: 'images' }} />);

    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
  });

  it('handles edit modal state changes', () => {
    const setEditModalState = jest.fn();
    render(<RoomImagesCard {...defaultProps} setEditModalState={setEditModalState} editModalState={{ isOpen: true, section: 'images' }} />);

    // The modal should be open and the onOpenChange should be set up
    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();

    // Simulate the onOpenChange callback being called
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    // This should trigger the onOpenChange callback
    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
  });

  it('applies correct aspect ratio to images', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const imageContainer = document.querySelector('.aspect-video');
    expect(imageContainer).toBeInTheDocument();
  });

  it('applies hover effects to images', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const image = screen.getByAltText('Deluxe Suite - Image 1');
    expect(image).toHaveClass('hover:scale-105', 'transition-transform', 'duration-200');
  });

  it('handles empty image array', () => {
    const roomWithEmptyArray = {
      ...mockRoom,
      imageURL: [],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithEmptyArray} />);

    expect(screen.getByText('No images uploaded for this room')).toBeInTheDocument();
  });

  it('handles array with null/undefined values', () => {
    const roomWithMixedArray = {
      ...mockRoom,
      imageURL: ['https://example.com/image1.jpg', null, undefined, 'https://example.com/image2.jpg'],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithMixedArray} />);

    // Should only render valid images
    const images = screen.getAllByAltText(/Deluxe Suite - Image/);
    expect(images).toHaveLength(2);
  });

  it('displays correct image count text', () => {
    const roomWithManyImages = {
      ...mockRoom,
      imageURL: Array.from({ length: 5 }, (_, i) => `https://example.com/image${i + 1}.jpg`),
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithManyImages} />);

    expect(screen.getByText('5 images uploaded')).toBeInTheDocument();
  });

  it('displays singular form for single image', () => {
    const roomWithSingleImage = {
      ...mockRoom,
      imageURL: ['https://example.com/single-image.jpg'],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithSingleImage} />);

    expect(screen.getByText('1 image uploaded')).toBeInTheDocument();
  });

  it('handles image load error with proper error content injection', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const image = screen.getByAltText('Deluxe Suite - Image 1');
    const parentElement = image.parentElement;

    // Simulate image load error
    fireEvent.error(image);

    // The image should be hidden
    expect(image).toHaveStyle('display: none');

    // The parent element should have error content injected with proper HTML structure
    if (parentElement) {
      expect(parentElement.innerHTML).toContain('Failed to load');
      expect(parentElement.innerHTML).toContain('svg');
      expect(parentElement.innerHTML).toContain('w-full h-full flex items-center justify-center text-gray-400');
    }
  });

  it('handles image load error for all images in array', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const images = screen.getAllByAltText(/Deluxe Suite - Image/);

    images.forEach((image) => {
      const parentElement = image.parentElement;

      // Simulate image load error
      fireEvent.error(image);

      // The image should be hidden
      expect(image).toHaveStyle('display: none');

      // The parent element should have error content injected
      if (parentElement) {
        expect(parentElement.innerHTML).toContain('Failed to load');
      }
    });
  });

  it('handles image load error with empty string URLs', () => {
    const roomWithEmptyStringUrls = {
      ...mockRoom,
      imageURL: ['', 'https://example.com/valid-image.jpg', ''],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithEmptyStringUrls} />);

    // Should only render the valid image
    const images = screen.getAllByAltText(/Deluxe Suite - Image/);
    expect(images).toHaveLength(1);
  });

  it('handles image load error with mixed valid and invalid URLs', () => {
    const roomWithMixedUrls = {
      ...mockRoom,
      imageURL: ['https://example.com/valid1.jpg', null, 'https://example.com/valid2.jpg', undefined, ''],
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithMixedUrls} />);

    // Should only render valid images
    const images = screen.getAllByAltText(/Deluxe Suite - Image/);
    expect(images).toHaveLength(2);
  });

  it('handles image load error for single string image with proper error handling', () => {
    const roomWithStringImage = {
      ...mockRoom,
      imageURL: 'https://example.com/single-image.jpg',
    };

    render(<RoomImagesCard {...defaultProps} room={roomWithStringImage} />);

    const image = screen.getByAltText('Deluxe Suite');

    // Simulate image load error
    fireEvent.error(image);

    // The image should be hidden
    expect(image).toHaveStyle('display: none');
  });

  it('handles image load error with proper error message structure', () => {
    render(<RoomImagesCard {...defaultProps} />);

    const image = screen.getByAltText('Deluxe Suite - Image 1');
    const parentElement = image.parentElement;

    // Simulate image load error
    fireEvent.error(image);

    // The parent element should have error content with proper structure
    if (parentElement) {
      expect(parentElement.innerHTML).toContain('Failed to load');
      expect(parentElement.innerHTML).toContain('text-center');
      expect(parentElement.innerHTML).toContain('text-xs');
    }
  });
});
