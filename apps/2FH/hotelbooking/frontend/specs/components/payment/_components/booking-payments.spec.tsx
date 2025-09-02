// BookingPayment.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { useOtpContext } from '@/components/providers';
import { useCreateBookingMutation, useUpdateUserMutationMutation } from '@/generated';
import { toast } from 'sonner';
import { BookingPayment } from '@/components/payment/_components/BookingPayment';

jest.mock('@/components/providers');
jest.mock('@/generated');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BookingPayment', () => {
  const mockSetBookingData = jest.fn();
  const mockSetBookingSuccess = jest.fn();
  const mockCreateBooking = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useOtpContext as jest.Mock).mockReturnValue({
      bookingData: { hotelId: 'h1', roomId: 'r1' },
      setBookingData: mockSetBookingData,
      setBookingSuccess: mockSetBookingSuccess,
    });

    (useCreateBookingMutation as jest.Mock).mockReturnValue([mockCreateBooking, { loading: false }]);

    (useUpdateUserMutationMutation as jest.Mock).mockReturnValue([mockUpdateUser]);
  });

  it('1. Renders form fields correctly', () => {
    render(<BookingPayment />);
    expect(screen.getByText(/Whos checking/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter firstname/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter lastname/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByTestId('Complete-Booking-Btn')).toBeInTheDocument();
  });

  it('2. Submits form and calls mutations', async () => {
    mockCreateBooking.mockResolvedValue({
      data: { createBooking: { bookingId: 'b1' } },
    });
    mockUpdateUser.mockResolvedValue({});

    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText(/Enter firstname/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter lastname/i), {
      target: { value: 'Doe' },
    });

    fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockSetBookingData).toHaveBeenCalledWith(expect.objectContaining({ bookingId: 'b1' }));
      expect(mockSetBookingSuccess).toHaveBeenCalledWith(true);
      expect(toast.success).toHaveBeenCalledWith('Booking success');
    });
  });

  it('3. Shows error toast when submission fails', async () => {
    mockCreateBooking.mockRejectedValue(new Error('Network error'));

    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText(/Enter firstname/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter lastname/i), {
      target: { value: 'Smith' },
    });

    fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Booking error');
    });
  });
  it('4. Renders <LoadingSvg /> when loading', () => {
    (useCreateBookingMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: true }]);

    render(<BookingPayment />);

    expect(screen.getByTestId('Complete-Booking-Btn').querySelector('svg')).toBeInTheDocument();
  });
  it('5. Keeps bookingData unchanged if createBooking returns undefined', async () => {
    mockCreateBooking.mockResolvedValue({
      data: { createBooking: undefined },
    });
    mockUpdateUser.mockResolvedValue({});

    render(<BookingPayment />);

    fireEvent.change(screen.getByPlaceholderText(/Enter firstname/i), {
      target: { value: 'No' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter lastname/i), {
      target: { value: 'Booking' },
    });

    fireEvent.click(screen.getByTestId('Complete-Booking-Btn'));

    await waitFor(() => {
      expect(mockSetBookingData).toHaveBeenCalledWith({
        hotelId: 'h1',
        roomId: 'r1',
      });
      expect(mockSetBookingSuccess).toHaveBeenCalledWith(true);
      expect(toast.success).toHaveBeenCalledWith('Booking success');
    });
  });
});
