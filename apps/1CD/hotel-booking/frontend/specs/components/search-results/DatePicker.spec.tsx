import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { format } from 'date-fns';
import { DatePickerWithRange } from '@/components/DatePicker';

jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: { selected: any; onSelect: (_date: any) => void }) => (
    <div data-testid="calendar">
      <button data-testid="select-date" onClick={() => onSelect({ from: new Date('2024-12-01'), to: new Date('2024-12-10') })}>
        Select Date
      </button>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
}));

describe('DatePickerWithRange', () => {
  it('renders the date picker button with default date range', () => {
    const mockSetDate = jest.fn();

    render(<DatePickerWithRange date={undefined} setDate={mockSetDate} />);

    const button = screen.getByTestId('date-picker-btn');
    const today = format(new Date(), 'LLL dd, y');

    expect(button).toHaveTextContent(`${today} - ${today}`);
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('opens the date picker and selects a range', () => {
    const mockSetDate = jest.fn();

    render(<DatePickerWithRange date={undefined} setDate={mockSetDate} />);

    // Open the date picker
    const button = screen.getByTestId('date-picker-btn');
    fireEvent.click(button);

    // Ensure the calendar is visible
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toBeInTheDocument();

    // Select a date range
    const selectDateButton = screen.getByTestId('select-date');
    fireEvent.click(selectDateButton);

    // Check if setDate was called with the correct range
    expect(mockSetDate).toHaveBeenCalledWith({
      from: new Date('2024-12-01'),
      to: new Date('2024-12-10'),
    });
  });

  it('renders the date picker button with the selected date range', () => {
    const mockSetDate = jest.fn();

    render(<DatePickerWithRange date={{ from: new Date('2024-12-01'), to: new Date('2024-12-10') }} setDate={mockSetDate} />);

    const button = screen.getByTestId('date-picker-btn');
    expect(button).toHaveTextContent('Dec 01, 2024 - Dec 10, 2024');
  });
});
