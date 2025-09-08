/* eslint-disable  */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useGuestsData } from '@/components/guests/useGuestsData';
import GuestsPage from '@/components/guests/GuestsPage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the useGuestsData hook
jest.mock('@/components/guests/useGuestsData', () => ({
  useGuestsData: jest.fn(),
}));

// Mock the child components
jest.mock('@/components/guests/GuestsFilters', () => {
  return function MockGuestsFilters({ searchTerm, statusFilter, onSearchChange, onStatusFilterChange }: any) {
    return (
      <div data-testid="guests-filters">
        <input data-testid="search-input" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..." />
        <select data-testid="status-filter" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="all">All</option>
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    );
  };
});

jest.mock('@/components/guests/GuestsTable', () => {
  return function MockGuestsTable({ bookings, sortField, sortDirection, onSort, onRowClick }: any) {
    return (
      <div data-testid="guests-table">
        <table>
          <thead>
            <tr>
              <th>
                <button onClick={() => onSort('id')} data-testid="sort-id">
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button onClick={() => onSort('name')} data-testid="sort-name">
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button onClick={() => onSort('hotel')} data-testid="sort-hotel">
                  Hotel {sortField === 'hotel' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button onClick={() => onSort('guests')} data-testid="sort-guests">
                  Guests {sortField === 'guests' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
              <th>
                <button onClick={() => onSort('date')} data-testid="sort-date">
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking.id} onClick={() => onRowClick(booking.id)} data-testid={`booking-row-${booking.id}`}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.hotel}</td>
                <td>{booking.guests}</td>
                <td>{booking.date}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <div data-testid="no-bookings">No bookings found</div>}
      </div>
    );
  };
});

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};

describe('GuestsPage Component Tests', () => {
  const mockBookings = [
    {
      id: '1',
      originalId: 'original-1',
      name: 'John Doe',
      hotel: 'Test Hotel',
      rooms: 'Room 101',
      guests: '2 adults',
      date: '2024-01-15',
      status: 'BOOKED' as const,
    },
    {
      id: '2',
      originalId: 'original-2',
      name: 'Jane Smith',
      hotel: 'Another Hotel',
      rooms: 'Room 202',
      guests: '1 adult',
      date: '2024-01-20',
      status: 'COMPLETED' as const,
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useGuestsData as jest.Mock).mockReturnValue({
      bookings: mockBookings,
      loading: false,
      error: null,
    });
    mockPush.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render the guests page with title', () => {
      render(<GuestsPage />);
      expect(screen.getByText('Guests', { selector: '.text-2xl' })).toBeInTheDocument();
    });

    it('should render guests filters and table', () => {
      render(<GuestsPage />);
      expect(screen.getByTestId('guests-filters')).toBeInTheDocument();
      expect(screen.getByTestId('guests-table')).toBeInTheDocument();
    });

    it('should display bookings data', () => {
      render(<GuestsPage />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Guest Field Parsing', () => {
    it('should handle guests field with valid numbers', () => {
      (useGuestsData as jest.Mock).mockReturnValue({
        bookings: [
          {
            id: '1',
            originalId: 'original-1',
            name: 'Test Booking',
            hotel: 'Test Hotel',
            rooms: 'Room 101',
            guests: '2 adults',
            date: '2024-01-15',
            status: 'BOOKED' as const,
          },
        ],
        loading: false,
        error: null,
      });

      render(<GuestsPage />);
      expect(screen.getByText('Test Booking')).toBeInTheDocument();
    });

    it('should handle guests field with invalid format', () => {
      (useGuestsData as jest.Mock).mockReturnValue({
        bookings: [
          {
            id: '1',
            originalId: 'original-1',
            name: 'Test Booking',
            hotel: 'Test Hotel',
            rooms: 'Room 101',
            guests: 'invalid-format',
            date: '2024-01-15',
            status: 'BOOKED' as const,
          },
        ],
        loading: false,
        error: null,
      });

      render(<GuestsPage />);
      expect(screen.getByText('Test Booking')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('should handle sorting by different fields', () => {
      render(<GuestsPage />);

      // Click on name sort button
      const nameSortButton = screen.getByTestId('sort-name');
      fireEvent.click(nameSortButton);

      // Should render without errors
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle sorting by hotel field', () => {
      render(<GuestsPage />);

      // Click on hotel sort button
      const hotelSortButton = screen.getByTestId('sort-hotel');
      fireEvent.click(hotelSortButton);

      // Should render without errors
      expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    });

    it('should handle sorting by guests field', () => {
      render(<GuestsPage />);

      // Click on guests sort button
      const guestsSortButton = screen.getByTestId('sort-guests');
      fireEvent.click(guestsSortButton);

      // Should render without errors
      expect(screen.getByText('2 adults')).toBeInTheDocument();
    });
  });

  describe('Row Click Navigation', () => {
    it('should navigate when booking row is clicked', () => {
      render(<GuestsPage />);

      // Click on the first booking row
      const bookingRow = screen.getByTestId('booking-row-1');
      fireEvent.click(bookingRow);

      expect(mockPush).toHaveBeenCalledWith('/admin/guests/1');
    });

    it('should handle navigation with different booking IDs', () => {
      render(<GuestsPage />);

      // Click on the second booking row
      const bookingRow = screen.getByTestId('booking-row-2');
      fireEvent.click(bookingRow);

      expect(mockPush).toHaveBeenCalledWith('/admin/guests/2');
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state', () => {
      (useGuestsData as jest.Mock).mockReturnValue({
        bookings: [],
        loading: true,
        error: null,
      });

      render(<GuestsPage />);
      expect(screen.getByText('Loading guests...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      (useGuestsData as jest.Mock).mockReturnValue({
        bookings: [],
        loading: false,
        error: new Error('Failed to load guests'),
      });

      render(<GuestsPage />);
      expect(screen.getByText(/Error loading guests/)).toBeInTheDocument();
    });

    it('should show empty state when no bookings', () => {
      (useGuestsData as jest.Mock).mockReturnValue({
        bookings: [],
        loading: false,
        error: null,
      });

      render(<GuestsPage />);
      expect(screen.getByText('No guests found matching your criteria.')).toBeInTheDocument();
    });
  });

  describe('Search and Filter Functionality', () => {
    it('should handle search input changes', () => {
      render(<GuestsPage />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      expect(searchInput).toHaveValue('John');
    });

    it('should handle status filter changes', () => {
      render(<GuestsPage />);

      const statusFilter = screen.getByTestId('status-filter');
      fireEvent.change(statusFilter, { target: { value: 'BOOKED' } });

      expect(statusFilter).toHaveValue('BOOKED');
    });
  });
});
