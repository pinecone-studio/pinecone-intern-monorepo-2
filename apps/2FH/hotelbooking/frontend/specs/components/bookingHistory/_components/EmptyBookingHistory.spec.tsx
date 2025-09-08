import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyBookingHistory } from '@/components/BookingHistory/_components/EmptyBookingHistory';
import { useRouter } from 'next/navigation';

// router mock
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EmptyBookingHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders even when user is not provided', () => {
    render(<EmptyBookingHistory />);

    expect(screen.getByTestId('Empty-Booking-History')).toBeInTheDocument();
    expect(screen.getByText(/you have no upcoming trips/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Exploring/i })).toBeInTheDocument();
  });

  it('renders with user firstName when provided', () => {
    const mockUser = { getUserById: { firstName: 'John' } };

    render(<EmptyBookingHistory user={mockUser} />);

    expect(screen.getByText(/John, you have no upcoming trips/i)).toBeInTheDocument();
  });

  it('navigates home when button is clicked', () => {
    render(<EmptyBookingHistory />);

    const button = screen.getByRole('button', { name: /Start Exploring/i });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows loading after button click', () => {
    render(<EmptyBookingHistory />);

    const button = screen.getByRole('button', { name: /Start Exploring/i });
    fireEvent.click(button);

    expect(screen.queryByText('Start Exploring')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading-svg')).toBeInTheDocument();
  });
});
