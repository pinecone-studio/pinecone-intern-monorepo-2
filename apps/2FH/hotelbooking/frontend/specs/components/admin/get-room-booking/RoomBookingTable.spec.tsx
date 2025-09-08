import React from 'react';
import { render, screen } from '@testing-library/react';
import RoomBookingTable from '@/components/admin/get-room-booking/RoomBookingTable';

// Mock the child components
jest.mock('@/components/admin/get-room-booking/BookingsCard', () => ({
  __esModule: true,
  default: ({ hotelId }: { hotelId: string }) => <div data-testid="bookings-card">BookingsCard for hotel: {hotelId}</div>,
}));

jest.mock('@/components/admin/get-room-booking/RoomsCard', () => ({
  __esModule: true,
  default: ({ hotelId }: { hotelId: string }) => <div data-testid="rooms-card">RoomsCard for hotel: {hotelId}</div>,
}));

describe('RoomBookingTable', () => {
  const mockHotelId = 'hotel-123';

  it('renders the component with correct structure', () => {
    render(<RoomBookingTable hotelId={mockHotelId} />);

    expect(screen.getByTestId('bookings-card')).toBeInTheDocument();
    expect(screen.getByTestId('rooms-card')).toBeInTheDocument();
  });

  it('passes hotelId prop to child components', () => {
    render(<RoomBookingTable hotelId={mockHotelId} />);

    expect(screen.getByText(`BookingsCard for hotel: ${mockHotelId}`)).toBeInTheDocument();
    expect(screen.getByText(`RoomsCard for hotel: ${mockHotelId}`)).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(<RoomBookingTable hotelId={mockHotelId} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('gap-10');
  });

  it('handles different hotel IDs', () => {
    const differentHotelId = 'hotel-456';
    render(<RoomBookingTable hotelId={differentHotelId} />);

    expect(screen.getByText(`BookingsCard for hotel: ${differentHotelId}`)).toBeInTheDocument();
    expect(screen.getByText(`RoomsCard for hotel: ${differentHotelId}`)).toBeInTheDocument();
  });

  it('renders both components in correct order', () => {
    const { container } = render(<RoomBookingTable hotelId={mockHotelId} />);

    const children = Array.from(container.firstChild?.childNodes || []);
    expect(children).toHaveLength(2);

    // First child should be BookingsCard
    expect(children[0]).toHaveAttribute('data-testid', 'bookings-card');
    // Second child should be RoomsCard
    expect(children[1]).toHaveAttribute('data-testid', 'rooms-card');
  });
});
