/* eslint-disable no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectStartTime } from '@/app/(admin)/ticket/_components/SelectStartHour';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
jest.mock('@/components/ui/form', () => ({
  FormItem: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  FormLabel: ({ children, ...props }: { children: ReactNode }) => <label {...props}>{children}</label>,
}));
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, ...props }: { children: ReactNode; value: string; onValueChange: (value: string) => void }) => (
    <div {...props} data-value={value} onClick={() => onValueChange?.('09:00')}>
      {children}
    </div>
  ),
  SelectContent: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  SelectItem: ({ children, value, ...props }: { children: ReactNode; value: string }) => (
    <option {...props} value={value}>
      {children}
    </option>
  ),
  SelectTrigger: ({ children, ...props }: { children: ReactNode }) => <button {...props}>{children}</button>,
  SelectValue: ({ placeholder, ...props }: { placeholder: string }) => <span {...props}>{placeholder}</span>,
}));

describe('SelectStartTime', () => {
  const mockProps = {
    startHour: '08:00',
    getHourNumber: jest.fn((timeString) => parseInt(timeString.split(':')[0])),
    setStartHour: jest.fn(),
    setEndHour: jest.fn(),
    hourOptions: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    endHour: '10:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form item with correct test id', () => {
    render(<SelectStartTime {...mockProps} />);
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
  });

  it('renders form label with Mongolian text', () => {
    render(<SelectStartTime {...mockProps} />);
    const label = screen.getByTestId('form-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('эхлэх цаг*');
  });

  it('renders select component with correct value', () => {
    render(<SelectStartTime {...mockProps} />);
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('data-value', '08:00');
  });

  it('renders select trigger with correct class and test id', () => {
    render(<SelectStartTime {...mockProps} />);
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass('w-[140px]');
  });

  it('renders select value with placeholder', () => {
    render(<SelectStartTime {...mockProps} />);
    const selectValue = screen.getByTestId('select-value');
    expect(selectValue).toBeInTheDocument();
    expect(selectValue).toHaveTextContent('Эхлэх цаг');
  });

  it('renders all hour options', () => {
    render(<SelectStartTime {...mockProps} />);
    mockProps.hourOptions.forEach((hour) => {
      const option = screen.getByTestId(`select-hour-${hour}`);
      expect(option).toBeInTheDocument();
      expect(option).toHaveTextContent(hour);
      expect(option).toHaveAttribute('value', hour);
    });
  });

  it('calls setStartHour when value changes', () => {
    render(<SelectStartTime {...mockProps} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    expect(mockProps.setStartHour).toHaveBeenCalledWith('09:00');
  });

  it('clears end hour when start hour is greater than or equal to end hour', () => {
    const props = {
      ...mockProps,
      endHour: '09:00',
    };
    render(<SelectStartTime {...props} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    expect(props.setEndHour).toHaveBeenCalledWith('');
  });

  it('does not clear end hour when start hour is less than end hour', () => {
    const props = {
      ...mockProps,
      endHour: '12:00',
    };
    render(<SelectStartTime {...props} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    expect(props.setEndHour).not.toHaveBeenCalled();
  });

  it('does not clear end hour when end hour is empty', () => {
    const props = {
      ...mockProps,
      endHour: '',
    };
    render(<SelectStartTime {...props} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    expect(props.setEndHour).not.toHaveBeenCalled();
  });

  it('calls getHourNumber with correct parameters', () => {
    render(<SelectStartTime {...mockProps} />);
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    expect(mockProps.getHourNumber).toHaveBeenCalledWith('09:00');
    expect(mockProps.getHourNumber).toHaveBeenCalledWith('10:00');
  });
});
