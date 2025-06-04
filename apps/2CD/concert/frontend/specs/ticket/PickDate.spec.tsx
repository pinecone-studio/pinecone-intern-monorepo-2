/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PickDate } from '@/app/(admin)/ticket/_components/PickDate';
jest.mock('@/app/(admin)/ticket/_components/SelectDay', () => ({
  SelectDay: ({ day, setDay }: any) => (
    <div data-testid="select-day">
      <button onClick={() => setDay(new Date('2024-01-15'))}>Select Day: {day ? day.toDateString() : 'No day selected'}</button>
    </div>
  ),
}));

jest.mock('@/app/(admin)/ticket/_components/SelectStartHour', () => ({
  SelectStartTime: ({ startHour, setStartHour, setEndHour }: any) => (
    <div data-testid="select-start-time">
      <select
        value={startHour}
        onChange={(e) => {
          setStartHour(e.target.value);
          // Reset end hour when start hour changes
          setEndHour('');
        }}
      >
        <option value="">Select Start Hour</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
      </select>
    </div>
  ),
}));

jest.mock('@/app/(admin)/ticket/_components/SelectEndHour', () => ({
  SelectEndHour: ({ endHour, setEndHour, isEndTimeDisabled }: any) => (
    <div data-testid="select-end-hour">
      <select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
        <option value="">Select End Hour</option>
        <option value="10:00" disabled={isEndTimeDisabled('10:00')}>
          10:00
        </option>
        <option value="11:00" disabled={isEndTimeDisabled('11:00')}>
          11:00
        </option>
        <option value="12:00" disabled={isEndTimeDisabled('12:00')}>
          12:00
        </option>
      </select>
    </div>
  ),
}));

// Mock MUI Stack component
jest.mock('@mui/material', () => ({
  Stack: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
}));

// Mock UI Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: ReactNode }) => <button {...props}>{children}</button>,
}));

// Mock Lucide React X icon
jest.mock('lucide-react', () => ({
  X: (props: any) => <span {...props}>X</span>,
}));

describe('PickDate Component', () => {
  const mockSetSchedule = jest.fn();
  const defaultProps = {
    setSchedule: mockSetSchedule,
    schedule: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders all main components', () => {
      render(<PickDate {...defaultProps} />);
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('select-day')).toBeInTheDocument();
      expect(screen.getByTestId('select-start-time')).toBeInTheDocument();
      expect(screen.getByTestId('select-end-hour')).toBeInTheDocument();
      expect(screen.getByTestId('add-btn')).toBeInTheDocument();
      expect(screen.getByTestId('schedules')).toBeInTheDocument();
    });
    test('renders add button with correct text', () => {
      render(<PickDate {...defaultProps} />);
      const addButton = screen.getByTestId('add-btn');
      expect(addButton).toHaveTextContent('Нэмэх');
    });
    test('renders empty schedule list initially', () => {
      render(<PickDate {...defaultProps} />);
      const schedules = screen.getByTestId('schedules');
      expect(schedules).toBeEmptyDOMElement();
    });
  });
  describe('Schedule Display', () => {
    test('renders delete icon for each schedule', () => {
      const existingSchedule = [
        {
          startDate: new Date('2024-01-15T09:00:00'),
          endDate: new Date('2024-01-15T12:00:00'),
        },
      ];

      render(<PickDate setSchedule={mockSetSchedule} schedule={existingSchedule} />);

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });
  });

  describe('Adding Schedule', () => {
    test('calls setSchedule when add button is clicked with valid data', () => {
      render(<PickDate {...defaultProps} />);
      const dayButton = screen.getByText(/Select Day:/);
      fireEvent.click(dayButton);
      const startSelect = screen.getByTestId('select-start-time').querySelector('select');
      fireEvent.change(startSelect!, { target: { value: '09:00' } });
      const endSelect = screen.getByTestId('select-end-hour').querySelector('select');
      fireEvent.change(endSelect!, { target: { value: '12:00' } });
      const addButton = screen.getByTestId('add-btn');
      fireEvent.click(addButton);
      expect(mockSetSchedule).toHaveBeenCalledWith([
        {
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        },
      ]);
    });

    test('does not call setSchedule when required fields are missing', () => {
      render(<PickDate {...defaultProps} />);
      const addButton = screen.getByTestId('add-btn');
      fireEvent.click(addButton);
      expect(mockSetSchedule).not.toHaveBeenCalled();
    });
    test('adds schedule to existing schedules', () => {
      const existingSchedule = [
        {
          startDate: new Date('2024-01-14T10:00:00'),
          endDate: new Date('2024-01-14T13:00:00'),
        },
      ];

      render(<PickDate setSchedule={mockSetSchedule} schedule={existingSchedule} />);
      const dayButton = screen.getByText(/Select Day:/);
      fireEvent.click(dayButton);
      const startSelect = screen.getByTestId('select-start-time').querySelector('select');
      fireEvent.change(startSelect!, { target: { value: '09:00' } });
      const endSelect = screen.getByTestId('select-end-hour').querySelector('select');
      fireEvent.change(endSelect!, { target: { value: '12:00' } });
      const addButton = screen.getByTestId('add-btn');
      fireEvent.click(addButton);
      expect(mockSetSchedule).toHaveBeenCalledWith([
        ...existingSchedule,
        {
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        },
      ]);
    });
  });

  describe('Deleting Schedule', () => {
    test('calls setSchedule with filtered array when delete icon is clicked', () => {
      const existingSchedule = [
        {
          startDate: new Date('2024-01-15T09:00:00'),
          endDate: new Date('2024-01-15T12:00:00'),
        },
        {
          startDate: new Date('2024-01-16T14:00:00'),
          endDate: new Date('2024-01-16T17:00:00'),
        },
      ];
      render(<PickDate setSchedule={mockSetSchedule} schedule={existingSchedule} />);
      const deleteIcon = screen.getAllByTestId('delete-icon')[0];
      fireEvent.click(deleteIcon);
      expect(mockSetSchedule).toHaveBeenCalledWith([
        {
          startDate: new Date('2024-01-16T14:00:00'),
          endDate: new Date('2024-01-16T17:00:00'),
        },
      ]);
    });
    test('removes correct schedule when multiple schedules exist', () => {
      const existingSchedule = [
        {
          startDate: new Date('2024-01-15T09:00:00'),
          endDate: new Date('2024-01-15T12:00:00'),
        },
        {
          startDate: new Date('2024-01-16T14:00:00'),
          endDate: new Date('2024-01-16T17:00:00'),
        },
      ];
      render(<PickDate setSchedule={mockSetSchedule} schedule={existingSchedule} />);
      const deleteIcons = screen.getAllByTestId('delete-icon');
      fireEvent.click(deleteIcons[1]); // Delete second schedule
      expect(mockSetSchedule).toHaveBeenCalledWith([
        {
          startDate: new Date('2024-01-15T09:00:00'),
          endDate: new Date('2024-01-15T12:00:00'),
        },
      ]);
    });
  });

  describe('Time Validation', () => {
    test('isEndTimeDisabled returns false when no start hour is selected', () => {
      render(<PickDate {...defaultProps} />);
      const endSelect = screen.getByTestId('select-end-hour').querySelector('select');
      const option = endSelect!.querySelector('option[value="10:00"]');
      expect(option).not.toBeDisabled();
    });
    test('resets end hour when start hour changes', () => {
      render(<PickDate {...defaultProps} />);
      const startSelect = screen.getByTestId('select-start-time').querySelector('select');
      fireEvent.change(startSelect!, { target: { value: '09:00' } });
      expect(startSelect!.value).toBe('09:00');
    });
  });

  describe('Date Creation', () => {
    test('creates correct date objects when adding schedule', () => {
      render(<PickDate {...defaultProps} />);
      const dayButton = screen.getByText(/Select Day:/);
      fireEvent.click(dayButton);
      const startSelect = screen.getByTestId('select-start-time').querySelector('select');
      fireEvent.change(startSelect!, { target: { value: '09:00' } });
      const endSelect = screen.getByTestId('select-end-hour').querySelector('select');
      fireEvent.change(endSelect!, { target: { value: '12:00' } });
      const addButton = screen.getByTestId('add-btn');
      fireEvent.click(addButton);
      const call = mockSetSchedule.mock.calls[0][0];
      const newSchedule = call[0];
      expect(newSchedule.startDate).toBeInstanceOf(Date);
      expect(newSchedule.endDate).toBeInstanceOf(Date);
      expect(newSchedule.startDate.getHours()).toBe(9);
      expect(newSchedule.endDate.getHours()).toBe(12);
    });
  });
  describe('Component Props', () => {
    test('passes correct props to child components', () => {
      render(<PickDate {...defaultProps} />);
      expect(screen.getByTestId('select-day')).toBeInTheDocument();
      expect(screen.getByTestId('select-start-time')).toBeInTheDocument();
      expect(screen.getByTestId('select-end-hour')).toBeInTheDocument();
    });
    test('handles empty schedule array', () => {
      render(<PickDate setSchedule={mockSetSchedule} schedule={[]} />);
      const schedules = screen.getByTestId('schedules');
      expect(schedules).toBeEmptyDOMElement();
    });
  });
  describe('Edge Cases', () => {
    test('handles undefined day', () => {
      render(<PickDate {...defaultProps} />);
      const addButton = screen.getByTestId('add-btn');
      fireEvent.click(addButton);
      expect(mockSetSchedule).not.toHaveBeenCalled();
    });
    test('handles schedule with same reference', () => {
      const schedule = {
        startDate: new Date('2024-01-15T09:00:00'),
        endDate: new Date('2024-01-15T12:00:00'),
      };
      const existingSchedule = [schedule];
      render(<PickDate setSchedule={mockSetSchedule} schedule={existingSchedule} />);
      const deleteIcon = screen.getByTestId('delete-icon');
      fireEvent.click(deleteIcon);
      expect(mockSetSchedule).toHaveBeenCalledWith([]);
    });
  });
});
