import { BookingPayment } from '@/components/payment/_components/BookingPayment/BookingPayment';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { useOtpContext } from '@/components/providers';

jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/generated', () => ({
  useCreateBookingInputMutation: () => [jest.fn(), { loading: true, error: false }],
}));

const mockBookingData = {
  userId: '68b017713bb2696705c69369',
  adults: 2,
  children: 1,
  hotelId: '689d5d72980117e81dad2925',
  roomId: '68b680fbefcd61d7eacdd6fa',
  checkInDate: '2025-09-10',
  checkOutDate: '2025-09-15',
  roomCustomer: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'John@gmail.com',
    phoneNumber: '1234567890',
  },
};
const mockSetBookingSuccess = jest.fn();
const mockSetBookingData = jest.fn();

describe('BookingPayment Component - loading state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOtpContext as jest.Mock).mockReturnValue({
      bookingData: mockBookingData,
      setBookingData: mockSetBookingData,
      setBookingSuccess: mockSetBookingSuccess,
    });
  });

  it('should render <LoadingSvg /> when loading is true', () => {
    const { getByTestId } = render(
      <MockedProvider>
        <BookingPayment />
      </MockedProvider>
    );

    expect(getByTestId('loading-svg')).toBeInTheDocument();
  });
});
