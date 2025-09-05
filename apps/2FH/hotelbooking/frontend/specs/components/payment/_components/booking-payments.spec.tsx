import { BookingPayment } from '@/components/payment/_components/BookingPayment/BookingPayment';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render } from '@testing-library/react';
import { CreateBookingInputDocument } from '@/generated';
import { act } from 'react-dom/test-utils';
import { useOtpContext } from '@/components';

const mockHandleCreateBooking = jest.fn();

const createBookingMocked: MockedResponse = {
  request: {
    query: CreateBookingInputDocument,
    variables: {
      input: {
        userId: '1',
        hotelId: '1',
        roomId: '1',
        checkInDate: '2025-09-05',
        checkOutDate: '2025-09-10',
        roomCustomer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '1234567890',
        },
      },
    },
  },
  result: {
    data: {
      createBooking: {
        id: '1',
        userId: '1',
        hotelId: '1',
        roomId: '1',
        checkInDate: '2025-09-05',
        checkOutDate: '2025-09-10',
        roomCustomer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '1234567890',
        },
      },
    },
  },
};

describe('Booking Payment Component test', () => {
  it('Should render Booking Paymend Component', async () => {
    (useOtpContext as jest.Mock) = jest.fn().mockReturnValue({
      handleCreateBooking: mockHandleCreateBooking,
    });
    const { getByTestId } = render(
      <MockedProvider mocks={[createBookingMocked]}>
        <BookingPayment />
      </MockedProvider>
    );
    const inputOne = getByTestId('Input-1');
    const inputTwo = getByTestId('Input-2');
    const inputThree = getByTestId('Input-3');
    const inputFour = getByTestId('Input-4');
    const button = getByTestId('Complete-Booking-Btn');
    act(() => {
      fireEvent.change(inputOne, { target: { value: 'John' } });
      fireEvent.change(inputTwo, { target: { value: 'Doe' } });
      fireEvent.change(inputThree, { target: { value: 'john@gmail.com' } });
      fireEvent.change(inputFour, { target: { value: '98765432' } });
      fireEvent.click(button);
    });
    expect(inputOne).toBeInTheDocument();
  });
});
