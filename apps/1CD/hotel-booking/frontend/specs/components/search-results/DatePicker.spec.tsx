import { Context } from '@/app/(user)/(public)/layout';
import { DatePickerWithRange } from '@/components/DatePicker';
import { render, fireEvent } from '@testing-library/react';
import { Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeContextType = {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
  roomType: string;
  setRoomType: Dispatch<SetStateAction<string>>;
} | null;
describe('DatePickerWithRange', () => {
  const mockSetDate = jest.fn();
  const mockData: DateRangeContextType =
    {
      date: {
        from: new Date(),
        to: new Date(),
      },
      roomType: '',
      setDate: jest.fn(),
      setRoomType: jest.fn(),
    } || undefined;

  it('1. should render', () => {
    const { getByTestId, getByRole } = render(<DatePickerWithRange />);
    fireEvent.click(getByTestId('date-picker-btn'));
    // fireEvent.click(getByText('5'));

    const calendar = getByRole('dialog');
    fireEvent.click(calendar);
    mockSetDate(mockData);

    expect(mockSetDate).toHaveBeenCalledWith(mockData);
  });
  it('2. should render new value', () => {
    render(
      <Context.Provider value={{ ...mockData }}>
        <DatePickerWithRange />
      </Context.Provider>
    );
  });
});
