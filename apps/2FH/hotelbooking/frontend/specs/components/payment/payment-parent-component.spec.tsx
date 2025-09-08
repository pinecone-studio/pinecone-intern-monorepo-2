import { render, screen } from '@testing-library/react';
import { PaymentParentComp } from '@/components/payment/PaymentParentComp';
import { useOtpContext } from '@/components/providers';

jest.mock('@/components/providers');

jest.mock('@/components/payment/_components/ConfirmedBooking/ConfirmedBooking', () => ({
  ConfirmedBooking: jest.fn(() => <div data-testid="Confirmed-Booking-Container">ConfirmedBooking</div>),
}));
jest.mock('@/components/payment/_components/BookingPayment/BookingPayment', () => ({
  BookingPayment: jest.fn(() => <div>BookingPayment</div>),
}));
jest.mock('@/components/payment/_components/RoomInformation', () => ({
  RoomInformation: jest.fn(() => <div>RoomInformation</div>),
}));

describe('PaymentParentComp', () => {
  it('renders ConfirmedBooking when bookingSuccess is true', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ bookingSuccess: true });

    render(<PaymentParentComp />);

    expect(screen.getByTestId('Confirmed-Booking-Container')).toBeInTheDocument();
    expect(screen.queryByText('BookingPayment')).toBeNull();
    expect(screen.queryByText('RoomInformation')).toBeNull();
  });

  it('renders BookingPayment and RoomInformation when bookingSuccess is false', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ bookingSuccess: false });

    render(<PaymentParentComp />);

    expect(screen.getByText('BookingPayment')).toBeInTheDocument();
    expect(screen.getByText('RoomInformation')).toBeInTheDocument();
    expect(screen.queryByTestId('Confirmed-Booking-Container')).toBeNull();
  });
});
