import BookingDetailCheckInDialog from '@/components/BookingDetailCheckInDialog';
import { fireEvent, render } from '@testing-library/react';

describe('booking detail checkin dialog test', () => {
  const mockJestfunc = jest.fn();
  it('it should render', () => {
    const { getByTestId } = render(<BookingDetailCheckInDialog openCheckInDialog={true} setOpenCheckInDialog={mockJestfunc} />);
    const closeDialogButton = getByTestId('Close-CheckIn-Dialog-Button');
    fireEvent.click(closeDialogButton);
  });
});
