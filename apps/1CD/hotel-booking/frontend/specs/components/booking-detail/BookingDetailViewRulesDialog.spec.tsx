import BookingDetailViewRulesDialog from '@/components/BookingDetailViewRulesDialog';
import { fireEvent, render } from '@testing-library/react';

describe('Booking detail view rules dialog', () => {
  it('it should render and click dialog close button', () => {
    const { getByTestId } = render(<BookingDetailViewRulesDialog openViewRulesDialog={true} setOpenViewRulesDialog={jest.fn()} />);
    const closeViewRulesDialogButton = getByTestId('Close-View-Rules-Dialog-Button');

    fireEvent.click(closeViewRulesDialogButton);
  });
});
