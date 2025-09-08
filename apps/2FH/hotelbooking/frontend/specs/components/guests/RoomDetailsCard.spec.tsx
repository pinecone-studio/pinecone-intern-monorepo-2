import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomDetailsCard from '@/components/guests/RoomDetailsCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, onError }: any) => <img src={src} alt={alt} className={className} data-testid="room-image" onError={onError} />,
}));

// Mock RoomPhotosModal
jest.mock('@/components/guests/RoomPhotosModal', () => ({
  __esModule: true,
  default: ({ roomImages, roomName }: any) => (
    <div data-testid="room-photos-modal">
      <button>{`View Photos (${roomImages.length}) - ${roomName}`}</button>
    </div>
  ),
}));

describe('RoomDetailsCard', () => {
  const mockBooking = { roomId: 'room-12345678' };

  const baseRoom = {
    name: 'Deluxe Suite',
    imageURL: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  };

  it('renders with room name and images', () => {
    render(<RoomDetailsCard room={baseRoom} booking={mockBooking} />);
    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(screen.getByTestId('room-photos-modal')).toBeInTheDocument();
  });

  it('uses fallback room name if none provided', () => {
    render(<RoomDetailsCard room={{ ...baseRoom, name: undefined }} booking={mockBooking} />);
    expect(screen.getByText('Room 12345678')).toBeInTheDocument();
  });

  it('handles string imageURL (covers fallback return array)', () => {
    const room = { ...baseRoom, imageURL: 'https://example.com/single.jpg' };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', 'https://example.com/single.jpg');
    expect(screen.getByText('View Photos (1) - Deluxe Suite')).toBeInTheDocument();
  });

  it('handles no imageURL (undefined)', () => {
    const room = { ...baseRoom, imageURL: undefined };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', '/placeholder-room.jpg');
    expect(screen.getByText('View Photos (0) - Deluxe Suite')).toBeInTheDocument();
  });

  it('handles null imageURL', () => {
    const room = { ...baseRoom, imageURL: null as any };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', '/placeholder-room.jpg');
  });

  it('handles empty array imageURL', () => {
    const room = { ...baseRoom, imageURL: [] };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', '/placeholder-room.jpg');
    expect(screen.getByText('View Photos (0) - Deluxe Suite')).toBeInTheDocument();
  });

  it('filters out invalid images from array', () => {
    const room = { ...baseRoom, imageURL: ['https://example.com/valid.jpg', null, '', undefined] as any };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByText('View Photos (1) - Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', 'https://example.com/valid.jpg');
  });

  it('falls back to placeholder when first array element is invalid', () => {
    const room = { ...baseRoom, imageURL: [null, 'https://example.com/second.jpg'] as any };
    render(<RoomDetailsCard room={room} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveAttribute('src', '/placeholder-room.jpg');
  });

  it('falls back to placeholder when image fails to load', () => {
    render(<RoomDetailsCard room={baseRoom} booking={mockBooking} />);
    const image = screen.getByTestId('room-image');
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/placeholder-room.jpg');
  });

  it('applies correct styling to image', () => {
    render(<RoomDetailsCard room={baseRoom} booking={mockBooking} />);
    expect(screen.getByTestId('room-image')).toHaveClass('object-cover');
  });
});
