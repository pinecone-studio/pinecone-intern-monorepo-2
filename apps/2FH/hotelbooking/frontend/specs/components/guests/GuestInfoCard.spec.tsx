/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuestInfoCard from '@/components/guests/GuestInfoCard';

// Mock dependencies
jest.mock('@/components/guests/CheckoutModal', () => ({
  __esModule: true,
  default: ({ bookingId, currentStatus, onStatusUpdate }: any) => (
    <div data-testid="checkout-modal">
      <div>Checkout Modal - {currentStatus}</div>
      <button onClick={onStatusUpdate}>Update Status</button>
    </div>
  ),
}));

describe('GuestInfoCard', () => {
  const mockGuestInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+976 99112233',
    guestRequest: 'Late check-in requested',
    roomNumber: 'Room #101',
  };

  const mockBooking = {
    id: 'booking-1',
    status: 'BOOKED',
    adults: 2,
    children: 1,
    checkInDate: '2024-02-01T14:00:00Z',
    checkOutDate: '2024-02-03T11:00:00Z',
  };

  const defaultProps = {
    guestInfo: mockGuestInfo,
    booking: mockBooking,
    onStatusUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders guest information correctly', () => {
    render(<GuestInfoCard {...defaultProps} />);

    expect(screen.getByText('Guest Info')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('+976 99112233')).toBeInTheDocument();
    expect(screen.getByText('Late check-in requested')).toBeInTheDocument();
  });

  it('displays booking status with correct styling', () => {
    render(<GuestInfoCard {...defaultProps} />);

    const statusBadge = screen.getByText('Booked');
    expect(statusBadge).toHaveClass('bg-blue-600', 'text-white');
  });

  it('displays guest count correctly', () => {
    render(<GuestInfoCard {...defaultProps} />);

    expect(screen.getByText('2 adults, 1 children')).toBeInTheDocument();
  });

  it('displays guest count with singular forms', () => {
    const bookingWithSingular = {
      ...mockBooking,
      adults: 1,
      children: 0,
    };

    render(<GuestInfoCard {...defaultProps} booking={bookingWithSingular} />);

    expect(screen.getByText('1 adult, 0 children')).toBeInTheDocument();
  });

  it('formats check-in date correctly', () => {
    render(<GuestInfoCard {...defaultProps} />);

    // The date should be formatted as "Feb 1, Thursday, 10:00 PM"
    expect(screen.getByText(/Feb 1, Thursday, 10:00 PM/)).toBeInTheDocument();
  });

  it('formats check-out date correctly', () => {
    render(<GuestInfoCard {...defaultProps} />);

    // The date should be formatted as "Feb 3, Saturday, 7:00 PM"
    expect(screen.getByText(/Feb 3, Saturday, 7:00 PM/)).toBeInTheDocument();
  });

  it('handles different booking statuses', () => {
    const completedBooking = { ...mockBooking, status: 'COMPLETED' };
    render(<GuestInfoCard {...defaultProps} booking={completedBooking} />);

    const statusBadge = screen.getByText('Completed');
    expect(statusBadge).toHaveClass('bg-green-600', 'text-white');
  });

  it('handles cancelled booking status', () => {
    const cancelledBooking = { ...mockBooking, status: 'CANCELLED' };
    render(<GuestInfoCard {...defaultProps} booking={cancelledBooking} />);

    const statusBadge = screen.getByText('Cancelled');
    expect(statusBadge).toHaveClass('bg-orange-500', 'text-white');
  });

  it('handles unknown booking status', () => {
    const unknownBooking = { ...mockBooking, status: 'UNKNOWN' };
    render(<GuestInfoCard {...defaultProps} booking={unknownBooking} />);

    const statusBadge = screen.getByText('Unknown');
    expect(statusBadge).toHaveClass('bg-blue-600', 'text-white');
  });

  it('renders checkout modal', () => {
    render(<GuestInfoCard {...defaultProps} />);

    expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    expect(screen.getByText('Checkout Modal - BOOKED')).toBeInTheDocument();
  });

  it('handles status update', () => {
    const onStatusUpdate = jest.fn();
    render(<GuestInfoCard {...defaultProps} onStatusUpdate={onStatusUpdate} />);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    expect(onStatusUpdate).toHaveBeenCalled();
  });

  it('handles missing guest information', () => {
    const incompleteGuestInfo = {
      firstName: 'John',
      lastName: '',
      email: '',
      phone: '',
      guestRequest: '',
      roomNumber: '',
    };

    render(<GuestInfoCard {...defaultProps} guestInfo={incompleteGuestInfo} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    // Check that lastName field exists but is empty
    const lastNameField = screen.getByText('Last Name').closest('div')?.querySelector('p');
    expect(lastNameField).toBeInTheDocument();
    expect(lastNameField?.textContent).toBe('');
  });

  it('handles null/undefined guest information', () => {
    const nullGuestInfo = {
      firstName: null,
      lastName: undefined,
      email: null,
      phone: undefined,
      guestRequest: null,
      roomNumber: undefined,
    };

    render(<GuestInfoCard {...defaultProps} guestInfo={nullGuestInfo} />);

    // Should render without crashing
    expect(screen.getByText('Guest Info')).toBeInTheDocument();
  });

  it('handles missing booking information', () => {
    const incompleteBooking = {
      id: 'booking-1',
      status: 'BOOKED',
      adults: null,
      children: undefined,
      checkInDate: null,
      checkOutDate: undefined,
    };

    render(<GuestInfoCard {...defaultProps} booking={incompleteBooking} />);

    // Should handle null/undefined values gracefully
    expect(screen.getByText('Guest Info')).toBeInTheDocument();
  });

  it('renders with proper grid layout', () => {
    render(<GuestInfoCard {...defaultProps} />);

    const gridContainer = document.querySelector('.grid.grid-cols-2.gap-4');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders checkout modal at the bottom', () => {
    render(<GuestInfoCard {...defaultProps} />);

    const checkoutModal = screen.getByTestId('checkout-modal');
    const parentContainer = checkoutModal.closest('.flex.justify-end.mt-6');
    expect(parentContainer).toBeInTheDocument();
  });

  it('handles different date formats', () => {
    const bookingWithDifferentDates = {
      ...mockBooking,
      checkInDate: '2024-12-25T00:00:00Z',
      checkOutDate: '2024-12-27T23:59:59Z',
    };

    render(<GuestInfoCard {...defaultProps} booking={bookingWithDifferentDates} />);

    // Should format dates correctly regardless of format
    expect(screen.getByText(/Dec 25/)).toBeInTheDocument();
    expect(screen.getByText(/Dec 28/)).toBeInTheDocument();
  });

  it('handles edge case dates', () => {
    const bookingWithEdgeDates = {
      ...mockBooking,
      checkInDate: '2024-01-01T00:00:00Z',
      checkOutDate: '2024-12-31T23:59:59Z',
    };

    render(<GuestInfoCard {...defaultProps} booking={bookingWithEdgeDates} />);

    const jan1Elements = screen.getAllByText(/Jan 1/);
    expect(jan1Elements.length).toBeGreaterThanOrEqual(1);
    // Both check-in and check-out are Jan 1 in this test case
    expect(jan1Elements.length).toBeGreaterThanOrEqual(2);
  });

  it('handles invalid dates gracefully', () => {
    const bookingWithInvalidDates = {
      ...mockBooking,
      checkInDate: 'invalid-date',
      checkOutDate: 'another-invalid-date',
    };

    render(<GuestInfoCard {...defaultProps} booking={bookingWithInvalidDates} />);

    // Should not crash and should render the component
    expect(screen.getByText('Guest Info')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<GuestInfoCard {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with different status', () => {
    const completedBooking = { ...mockBooking, status: 'COMPLETED' };
    const { container } = render(<GuestInfoCard {...defaultProps} booking={completedBooking} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
