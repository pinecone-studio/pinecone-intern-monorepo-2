import { ConfirmedBooking } from '@/components/payment/_components/ConfirmedBooking/ConfirmedBooking';
import { render } from '@testing-library/react';

describe('Should render Confirmed Booking component', () => {
  it('1. Should render Confirmed Booking Component', async () => {
    const { getByTestId } = render(<ConfirmedBooking />);
    const container = getByTestId('Confirmed-Booking-Container');
    expect(container);
  });
});
