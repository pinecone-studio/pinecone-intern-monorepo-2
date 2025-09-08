/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestsTable from '@/components/guests/GuestsTable';

describe('GuestsTable', () => {
  const mockBookings = [
    {
      id: '0001',
      originalId: 'booking-1',
      name: 'John Doe',
      hotel: 'Grand Hotel',
      rooms: 'Deluxe Suite',
      guests: '2 Adults, 1 Child',
      date: 'Feb 01 - Feb 03',
      status: 'BOOKED' as const,
    },
    {
      id: '0002',
      originalId: 'booking-2',
      name: 'Jane Smith',
      hotel: 'City Hotel',
      rooms: 'Standard Room',
      guests: '1 Adult',
      date: 'Feb 05 - Feb 07',
      status: 'COMPLETED' as const,
    },
    {
      id: '0003',
      originalId: 'booking-3',
      name: 'Bob Johnson',
      hotel: 'Resort Hotel',
      rooms: 'Family Room',
      guests: '4 Adults, 2 Children',
      date: 'Feb 10 - Feb 12',
      status: 'CANCELLED' as const,
    },
  ];

  const defaultProps = {
    bookings: mockBookings,
    sortField: 'id' as const,
    sortDirection: 'asc' as const,
    onSort: jest.fn(),
    onRowClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with all bookings', () => {
    render(<GuestsTable {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<GuestsTable {...defaultProps} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Hotel')).toBeInTheDocument();
    expect(screen.getByText('Rooms')).toBeInTheDocument();
    expect(screen.getByText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders booking data correctly', () => {
    render(<GuestsTable {...defaultProps} />);

    expect(screen.getByText('0001')).toBeInTheDocument();
    expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('Deluxe Suite')).toBeInTheDocument();
    expect(screen.getByText('2 Adults, 1 Child')).toBeInTheDocument();
    expect(screen.getByText('Feb 01 - Feb 03')).toBeInTheDocument();
  });

  it('renders status badges with correct styling', () => {
    render(<GuestsTable {...defaultProps} />);

    const bookedBadge = screen.getByText('Booked');
    expect(bookedBadge).toHaveClass('bg-blue-600', 'text-white');

    const completedBadge = screen.getByText('Completed');
    expect(completedBadge).toHaveClass('bg-green-600', 'text-white');

    const cancelledBadge = screen.getByText('Cancelled');
    expect(cancelledBadge).toHaveClass('bg-orange-500', 'text-white');
  });

  it('handles row click', () => {
    render(<GuestsTable {...defaultProps} />);

    const johnRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(johnRow!);

    expect(defaultProps.onRowClick).toHaveBeenCalledWith('booking-1');
  });

  it('handles sortable header clicks', () => {
    render(<GuestsTable {...defaultProps} />);

    const idHeader = screen.getByText('ID');
    fireEvent.click(idHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('id');
  });

  it('handles rooms header click', () => {
    render(<GuestsTable {...defaultProps} />);

    const roomsHeader = screen.getByText('Rooms');
    fireEvent.click(roomsHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('rooms');
  });

  it('handles guests header click', () => {
    render(<GuestsTable {...defaultProps} />);

    const guestsHeader = screen.getByText('Guests');
    fireEvent.click(guestsHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('guests');
  });

  it('handles status header click', () => {
    render(<GuestsTable {...defaultProps} />);

    const statusHeader = screen.getByText('Status');
    fireEvent.click(statusHeader);

    expect(defaultProps.onSort).toHaveBeenCalledWith('status');
  });

  it('displays sort indicators for active sort field', () => {
    render(<GuestsTable {...defaultProps} />);

    // ID header should show sort indicator since it's the active sort field
    const idHeader = screen.getByText('ID');
    const sortIndicators = idHeader.querySelectorAll('svg');
    expect(sortIndicators.length).toBeGreaterThan(0);
  });

  it('displays ascending sort indicator', () => {
    render(<GuestsTable {...defaultProps} sortDirection="asc" />);

    const idHeader = screen.getByText('ID');
    const chevronUp = idHeader.querySelector('.text-gray-900');
    expect(chevronUp).toBeInTheDocument();
  });

  it('displays descending sort indicator', () => {
    render(<GuestsTable {...defaultProps} sortDirection="desc" />);

    const idHeader = screen.getByText('ID');
    const chevronDown = idHeader.querySelector('.text-gray-900');
    expect(chevronDown).toBeInTheDocument();
  });

  it('renders alternating row colors', () => {
    render(<GuestsTable {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    // First data row (index 1) should have white background
    expect(rows[1]).toHaveClass('bg-white');
    // Second data row (index 2) should have gray background
    expect(rows[2]).toHaveClass('bg-gray-50');
  });

  it('applies hover effects to rows', () => {
    render(<GuestsTable {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    // Data rows should have hover effects
    expect(rows[1]).toHaveClass('hover:bg-blue-50', 'transition-colors');
  });

  it('applies hover effects to sortable headers', () => {
    render(<GuestsTable {...defaultProps} />);

    const idHeader = screen.getByText('ID').closest('th');
    expect(idHeader).toHaveClass('cursor-pointer', 'hover:bg-gray-50');
  });

  it('handles empty bookings array', () => {
    render(<GuestsTable {...defaultProps} bookings={[]} />);

    // Should render table headers but no data rows
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles single booking', () => {
    const singleBooking = [mockBookings[0]];
    render(<GuestsTable {...defaultProps} bookings={singleBooking} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('handles different sort fields', () => {
    render(<GuestsTable {...defaultProps} sortField="rooms" sortDirection="desc" />);

    const roomsHeader = screen.getByText('Rooms');
    const sortIndicators = roomsHeader.querySelectorAll('svg');
    expect(sortIndicators.length).toBeGreaterThan(0);
  });

  it('handles unknown status gracefully', () => {
    const bookingWithUnknownStatus = {
      ...mockBookings[0],
      status: 'UNKNOWN_STATUS' as any,
    };

    render(<GuestsTable {...defaultProps} bookings={[bookingWithUnknownStatus]} />);

    expect(screen.getByText('Unknown_status')).toBeInTheDocument();
  });

  it('renders with proper table structure', () => {
    render(<GuestsTable {...defaultProps} />);

    const table = document.querySelector('table');
    expect(table).toBeInTheDocument();

    const tableHeader = document.querySelector('thead');
    expect(tableHeader).toBeInTheDocument();

    const tableBody = document.querySelector('tbody');
    expect(tableBody).toBeInTheDocument();
  });

  it('renders with proper container styling', () => {
    render(<GuestsTable {...defaultProps} />);

    const container = document.querySelector('.bg-white.rounded-lg.border');
    expect(container).toBeInTheDocument();
  });

  it('handles long booking data', () => {
    const bookingWithLongData = {
      id: '0001',
      originalId: 'booking-with-very-long-id-that-might-cause-layout-issues',
      name: 'John Doe with a very long name that might cause layout issues',
      hotel: 'Grand Hotel with a very long name that might cause layout issues',
      rooms: 'Deluxe Suite with a very long name that might cause layout issues',
      guests: '2 Adults, 1 Child with very long description',
      date: 'Feb 01 - Feb 03 with very long date description',
      status: 'BOOKED' as const,
    };

    render(<GuestsTable {...defaultProps} bookings={[bookingWithLongData]} />);

    expect(screen.getByText('John Doe with a very long name that might cause layout issues')).toBeInTheDocument();
  });

  it('handles special characters in booking data', () => {
    const bookingWithSpecialChars = {
      id: '0001',
      originalId: 'booking-1',
      name: 'John@Doe#123',
      hotel: 'Grand Hotel & Resort',
      rooms: 'Deluxe Suite (Premium)',
      guests: '2 Adults, 1 Child',
      date: 'Feb 01 - Feb 03',
      status: 'BOOKED' as const,
    };

    render(<GuestsTable {...defaultProps} bookings={[bookingWithSpecialChars]} />);

    expect(screen.getByText('John@Doe#123')).toBeInTheDocument();
    expect(screen.getByText('Grand Hotel & Resort')).toBeInTheDocument();
    expect(screen.getByText('Deluxe Suite (Premium)')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<GuestsTable {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with different sort direction', () => {
    const { container } = render(<GuestsTable {...defaultProps} sortDirection="desc" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with different sort field', () => {
    const { container } = render(<GuestsTable {...defaultProps} sortField="name" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
