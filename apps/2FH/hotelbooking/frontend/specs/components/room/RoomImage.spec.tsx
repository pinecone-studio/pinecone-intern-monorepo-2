import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { RoomImage } from '../../../src/components/room/RoomImage';

describe('RoomImage', () => {
  const defaultProps = {
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    render(<RoomImage {...defaultProps} />);

    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should display no photos message', () => {
    render(<RoomImage {...defaultProps} />);

    expect(screen.getByText('No Photos Uploaded')).toBeInTheDocument();
    expect(screen.getByText('Add photos of your rooms, amenities, or property to showcase your hotel.')).toBeInTheDocument();
  });

  it('should render with proper data-cy attribute', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toBeInTheDocument();
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toHaveClass('w-[400px]', 'h-65', 'px-6', 'pb-6', 'pt-4', 'flex', 'flex-col', 'gap-y-4', 'rounded-lg', 'border', 'border-solid');
  });

  it('should render edit button with proper styling', () => {
    render(<RoomImage {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    expect(editButton).toHaveClass('text-[#2563EB]', 'text-sm', 'font-medium', 'hover:text-blue-700', 'transition-colors', 'cursor-pointer');
  });

  it('should render image container with proper dimensions', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const imageContainer = container.querySelector('.w-\\[352px\\]');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('w-[352px]', 'py-8', 'flex', 'flex-col', 'gap-y-4', 'items-center');
  });

  it('should render ImageOff icon', () => {
    render(<RoomImage {...defaultProps} />);

    // The ImageOff icon should be present in the DOM
    const iconContainer = document.querySelector('.w-6.h-6');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should render title with proper styling', () => {
    render(<RoomImage {...defaultProps} />);

    const title = screen.getByText('Images');
    expect(title).toHaveClass('font-semibold', 'text-lg');
  });

  it('should render no photos title with proper styling', () => {
    render(<RoomImage {...defaultProps} />);

    const noPhotosTitle = screen.getByText('No Photos Uploaded');
    expect(noPhotosTitle).toHaveClass('text-sm', 'font-medium');
  });

  it('should render description with proper styling', () => {
    render(<RoomImage {...defaultProps} />);

    const description = screen.getByText('Add photos of your rooms, amenities, or property to showcase your hotel.');
    expect(description).toHaveClass('text-sm', 'font-normal', 'text-gray-500', 'text-center');
  });

  it('should have proper flex layout for header', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const header = container.querySelector('.flex.justify-between');
    expect(header).toBeInTheDocument();
  });

  it('should have proper flex layout for content', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const content = container.querySelector('.flex.flex-col.gap-y-1.items-center');
    expect(content).toBeInTheDocument();
  });

  it('should accept onSave prop', () => {
    const mockOnSave = jest.fn();
    render(<RoomImage onSave={mockOnSave} />);

    // Component should render without errors
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  it('should accept optional _images prop', () => {
    const images = ['image1.jpg', 'image2.jpg'];
    render(<RoomImage {...defaultProps} _images={images} />);

    // Component should render without errors even with images prop
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  it('should render with proper border styling', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toHaveClass('border', 'border-solid');
  });

  it('should render with proper padding', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toHaveClass('px-6', 'pb-6', 'pt-4');
  });

  it('should render with proper gap spacing', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toHaveClass('gap-y-4');
  });

  it('should render with proper rounded corners', () => {
    const { container } = render(<RoomImage {...defaultProps} />);

    const roomImageContainer = container.querySelector('[data-cy="Room-Image"]');
    expect(roomImageContainer).toHaveClass('rounded-lg');
  });
});
