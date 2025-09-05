import { BookingPayment } from '@/components/payment/_components/BookingPayment/BookingPayment';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import { useOtpContext } from '@/components/providers';
import { act } from 'react-dom/test-utils';

jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
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

const mockHandleCreateBooking = jest.fn().mockResolvedValue({
  data: {
    createBooking: {
      id: '1',
      userId: mockBookingData.userId,
      hotelId: mockBookingData.hotelId,
      roomId: mockBookingData.roomId,
      checkInDate: mockBookingData.checkInDate,
      checkOutDate: mockBookingData.checkOutDate,
      roomCustomer: { ...mockBookingData.roomCustomer },
      adults: mockBookingData.adults,
      children: mockBookingData.children,
    },
  },
});
const mockSetBookingSuccess = jest.fn();
const mockSetBookingData = jest.fn();

jest.mock('@/generated', () => ({
  useCreateBookingInputMutation: () => [
    mockHandleCreateBooking,
    {
      loading: false,
      error: false,
    },
  ],
}));

describe('Booking Payment Component test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOtpContext as jest.Mock).mockReturnValue({
      bookingData: mockBookingData,
      setBookingData: mockSetBookingData,
      setBookingSuccess: mockSetBookingSuccess,
    });
  });

  it('Should render Booking Paymend Component', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <BookingPayment />
      </MockedProvider>
    );

    const inputOne = getByTestId('Input-1');
    const inputTwo = getByTestId('Input-2');
    const inputThree = getByTestId('Input-3');
    const inputFour = getByTestId('Input-4');
    const button = getByTestId('Complete-Booking-Btn');
    fireEvent.change(inputOne, { target: { value: 'John' } });
    fireEvent.change(inputTwo, { target: { value: 'Doe' } });
    fireEvent.change(inputThree, { target: { value: 'John@gmail.com' } });
    fireEvent.change(inputFour, { target: { value: '1234567890' } });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mockHandleCreateBooking).toHaveBeenCalledWith({
      variables: {
        input: {
          userId: mockBookingData.userId,
          hotelId: mockBookingData.hotelId,
          roomId: mockBookingData.roomId,
          checkInDate: mockBookingData.checkInDate,
          checkOutDate: mockBookingData.checkOutDate,
          roomCustomer: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'John@gmail.com',
            phoneNumber: '1234567890',
          },
          adults: mockBookingData.adults,
          children: mockBookingData.children,
        },
      },
    });
    expect(mockSetBookingData).toHaveBeenCalledWith(expect.any(Function));
    const updateFn = mockSetBookingData.mock.calls[0][0];
    expect(updateFn(mockBookingData)).toEqual({
      ...mockBookingData,
      userId: mockBookingData.userId,
      hotelId: mockBookingData.hotelId,
      roomId: mockBookingData.roomId,
      checkInDate: mockBookingData.checkInDate,
      checkOutDate: mockBookingData.checkOutDate,
      roomCustomer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'John@gmail.com',
        phoneNumber: '1234567890',
      },
    });
  });

  it('Should throw error when create booking fails', () => {
    expect(() =>
      render(
        <MockedProvider>
          <BookingPayment />
        </MockedProvider>
      )
    );
  });
});
