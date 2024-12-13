import { DatePickerWithRange } from '@/components/DatePicker';
import { render, fireEvent, screen } from '@testing-library/react';

describe('DatePickerWithRange', () => {
  const mockSetDate = jest.fn();
  const mockDate = {
    from: new Date(2024, 11, 1),
    to: new Date(2024, 11, 10),
  };
  it('1. should render', () => {
    const { getByTestId, getByRole } = render(<DatePickerWithRange date={undefined} setDate={mockSetDate} />);
    fireEvent.click(getByTestId('date-picker-btn'));
    // fireEvent.click(getByText('5'));

    const calendar = getByRole('dialog');
    fireEvent.click(calendar);
    mockSetDate(mockDate);

    expect(mockSetDate).toHaveBeenCalledWith(mockDate);
  });
  it('2. should render new value', () => {
    render(<DatePickerWithRange date={mockDate} setDate={mockSetDate} />);
  });
});
