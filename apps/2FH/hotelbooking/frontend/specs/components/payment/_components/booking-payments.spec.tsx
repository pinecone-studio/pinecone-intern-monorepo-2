import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useCreateBookingMutation, useUpdateUserMutationMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { useOtpContext } from '@/components/providers';
import { BookingPayment } from '@/components/payment/_components/BookingPayment';

jest.mock('@/generated', () => ({
  useCreateBookingMutation: jest.fn(),
  useUpdateUserMutationMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));

jest.mock('@/components/signup/_components/assets/LoadingSvg', () => ({
  LoadingSvg: () => <div data-testid="loading-svg">Loading...</div>,
}));

describe('BookingPayment component', () => {
  const mockCreateBooking = jest.fn(() => Promise.resolve());
  const mockUpdateUser = jest.fn(() => Promise.resolve());
  const mockPush = jest.fn();
  const mockSetBookingSuccess = jest.fn();

  beforeEach(() => {
    (useCreateBookingMutation as jest.Mock).mockReturnValue([mockCreateBooking, { loading: false }]);
    (useUpdateUserMutationMutation as jest.Mock).mockReturnValue([mockUpdateUser]);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useOtpContext as jest.Mock).mockReturnValue({ setBookingSuccess: mockSetBookingSuccess });
  });

  it('1. Renders form inputs and button', () => {
    render(<BookingPayment />);

    expect(screen.getByPlaceholderText('Enter firstname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter lastname')).toBeInTheDocument();
    expect(screen.getByText('Complete booking')).toBeInTheDocument();
  });

  it('2. Submits the form correctly', async () => {
    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText('Enter firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Enter lastname'), { target: { value: 'Doe' } });

    act(() => {
      fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));
    });

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockSetBookingSuccess).toHaveBeenCalledWith(true);
      expect(mockPush).toHaveBeenCalledWith('/booking/1/confirmed');
    });
  });

  it('3. Shows loading state when submitting', async () => {
    const mockCreateBookingWithDelay = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    (useCreateBookingMutation as jest.Mock).mockReturnValue([mockCreateBookingWithDelay, { loading: true }]);

    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText('Enter firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Enter lastname'), { target: { value: 'Doe' } });

    act(() => {
      fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));
    });

    expect(screen.getByTestId('loading-svg')).toBeInTheDocument();
  });

  it('4. Shows error toast on mutation failure', async () => {
    const mockError = jest.fn().mockRejectedValue(new Error('Booking failed'));
    (useCreateBookingMutation as jest.Mock).mockReturnValue([mockError, { loading: false }]);

    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText('Enter firstname'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Enter lastname'), { target: { value: 'Doe' } });

    act(() => {
      fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));
    });

    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
    });
  });
});
