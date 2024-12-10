import { DatePickerWithRange } from '@/components/search-hotel/DatePicker';
import { render, act, fireEvent } from '@testing-library/react';

describe('DatePicker', () => {
  it('should render', () => {
    const { getByTestId } = render(<DatePickerWithRange />);
    const popover = getByTestId('date-picker-modal');
    const dateBtn = getByTestId('date-picker-btn');

    act(() => {
      fireEvent.click(dateBtn);
    });
    expect(dateBtn).toBeTruthy();
    expect(popover).toBeTruthy();
  });
});
