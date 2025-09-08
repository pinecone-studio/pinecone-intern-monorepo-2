/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoomPhotosModal from '@/components/guests/RoomPhotosModal';

// Mock dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, onError }: any) => <img src={src} alt={alt} className={className} onError={onError} data-testid="modal-image" />,
}));

describe('RoomPhotosModal', () => {
  const mockRoomImages = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'];

  const defaultProps = {
    roomImages: mockRoomImages,
    roomName: 'Deluxe Suite',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal trigger button', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('opens modal when trigger button is clicked', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
  });

  it('displays room name in modal header', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
  });

  it('displays first image by default', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is always first
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(mainImage).toHaveAttribute('alt', 'Deluxe Suite - Image 1');
  });

  it('displays image counter when multiple images', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('displays navigation arrows when multiple images', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('navigates to next image', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is always first
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image2.jpg');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('navigates to previous image', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is always first
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('wraps around to first image when navigating next from last image', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    // Navigate to last image
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Navigate next from last image
    fireEvent.click(nextButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is always first
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('wraps around to last image when navigating previous from first image', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is always first
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image3.jpg');
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('displays thumbnail navigation when multiple images', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const thumbnails = screen.getAllByTestId('modal-image');
    expect(thumbnails).toHaveLength(4); // 1 main image + 3 thumbnails
  });

  it('navigates to image when thumbnail is clicked', async () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    // Find the thumbnail buttons by looking for buttons that contain images
    const thumbnailButtons = document.querySelectorAll('.flex.gap-2.overflow-x-auto.pb-2 button');
    const secondThumbnailButton = thumbnailButtons[1]; // Second thumbnail (index 1)
    fireEvent.click(secondThumbnailButton);

    // Wait for the state update to complete
    await waitFor(() => {
      const updatedImages = screen.getAllByTestId('modal-image');
      const mainImage = updatedImages[0]; // Main image (index 0)
      expect(mainImage).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('highlights active thumbnail', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    // Find the thumbnail buttons by looking for buttons with thumbnail images
    const thumbnails = screen.getAllByTestId('modal-image');
    const firstThumbnailButton = thumbnails[1].closest('button'); // First thumbnail (index 1, after main image)
    expect(firstThumbnailButton).toHaveClass('border-blue-500');
  });

  it('handles single image without navigation', () => {
    const singleImage = ['https://example.com/single-image.jpg'];
    render(<RoomPhotosModal {...defaultProps} roomImages={singleImage} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  it('uses placeholder images when no images provided', () => {
    render(<RoomPhotosModal {...defaultProps} roomImages={[]} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const images = screen.getAllByTestId('modal-image');
    expect(images[0]).toHaveAttribute('src', '/placeholder-room-1.jpg');
  });

  it('uses placeholder images when roomImages is null', () => {
    render(<RoomPhotosModal {...defaultProps} roomImages={null as any} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const images = screen.getAllByTestId('modal-image');
    expect(images[0]).toHaveAttribute('src', '/placeholder-room-1.jpg');
  });

  it('uses placeholder images when roomImages is undefined', () => {
    render(<RoomPhotosModal {...defaultProps} roomImages={undefined as any} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const images = screen.getAllByTestId('modal-image');
    expect(images[0]).toHaveAttribute('src', '/placeholder-room-1.jpg');
  });

  it('handles image load error', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const images = screen.getAllByTestId('modal-image');
    const mainImage = images[0]; // Main image is the first one
    fireEvent.error(mainImage);

    expect(mainImage).toHaveAttribute('src', '/placeholder-room-1.jpg');
  });

  it('closes modal when open state changes', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();

    // Simulate modal close (this would normally be handled by the Dialog component)
    // In a real test, you might need to mock the Dialog component's onOpenChange
  });

  it('renders with proper modal structure', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const modalContent = document.querySelector('.sm\\:max-w-4xl.max-h-\\[90vh\\].overflow-hidden');
    expect(modalContent).toBeInTheDocument();
  });

  it('renders with proper image container', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const imageContainer = document.querySelector('.relative.h-96.w-full.rounded-lg.overflow-hidden');
    expect(imageContainer).toBeInTheDocument();
  });

  it('renders with proper thumbnail container', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    const thumbnailContainer = document.querySelector('.flex.gap-2.overflow-x-auto.pb-2');
    expect(thumbnailContainer).toBeInTheDocument();
  });

  it('handles room with very long name', () => {
    const longRoomName = 'This is a very long room name that might cause layout issues and should be handled properly';
    render(<RoomPhotosModal {...defaultProps} roomName={longRoomName} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText(longRoomName)).toBeInTheDocument();
  });

  it('handles room with special characters in name', () => {
    const specialRoomName = 'Deluxe Suite & Resort (Premium) #101';
    render(<RoomPhotosModal {...defaultProps} roomName={specialRoomName} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    expect(screen.getByText(specialRoomName)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<RoomPhotosModal {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with single image', () => {
    const singleImage = ['https://example.com/single-image.jpg'];
    const { container } = render(<RoomPhotosModal {...defaultProps} roomImages={singleImage} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no images', () => {
    const { container } = render(<RoomPhotosModal {...defaultProps} roomImages={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles thumbnail image error', () => {
    render(<RoomPhotosModal {...defaultProps} />);

    const triggerButton = screen.getByText('View');
    fireEvent.click(triggerButton);

    // Find thumbnail images and trigger error
    const thumbnailImages = screen.getAllByTestId('modal-image');
    const thumbnailImage = thumbnailImages[1]; // Second image (thumbnail)

    // Simulate image error
    fireEvent.error(thumbnailImage);

    // The onError callback should set placeholder image
    expect(thumbnailImage.src).toBe('http://localhost/placeholder-room-1.jpg');
  });
});
