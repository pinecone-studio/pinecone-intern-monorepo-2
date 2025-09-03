import { PaymentParentComp } from '@/components/payment/PaymentParentComp';
import { useOtpContext } from '@/components/providers';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/providers');
jest.mock('@/components/payment/_components/BookingPayment', () => ({
  BookingPayment: () => <div data-testid="BookingPayment">BookingPayment Component</div>,
}));
jest.mock('@/components/payment/_components/ConfirmedBooking/ConfirmedBooking', () => ({
  ConfirmedBooking: () => <div data-testid="ConfirmedBooking">ConfirmedBooking Component</div>,
}));
jest.mock('@/components/payment/_components/RoomInformation', () => ({
  RoomInformation: () => <div data-testid="RoomInformation">RoomInformation Component</div>,
}));

describe('PaymentParentComp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders BookingPayment and RoomInformation when bookingSuccess = false', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ bookingSuccess: false });

    render(<PaymentParentComp />);

    expect(screen.getByTestId('BookingPayment')).toBeInTheDocument();
    expect(screen.getByTestId('RoomInformation')).toBeInTheDocument();
    expect(screen.queryByTestId('ConfirmedBooking')).not.toBeInTheDocument();
  });

  it('renders ConfirmedBooking when bookingSuccess = true', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ bookingSuccess: true });

    render(<PaymentParentComp />);

    expect(screen.getByTestId('ConfirmedBooking')).toBeInTheDocument();
    expect(screen.queryByTestId('BookingPayment')).not.toBeInTheDocument();
    expect(screen.queryByTestId('RoomInformation')).not.toBeInTheDocument();
  });
});
