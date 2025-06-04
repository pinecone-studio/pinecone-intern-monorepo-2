/* eslint-disable no-unused-vars */
import { render, screen} from '@testing-library/react';
import { SelectEndHour } from '@/app/(admin)/ticket/_components';
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

describe('SelectEndHour', () => {
  const defaultProps = {
    endHour: '10:00',
    setEndHour: jest.fn(),
    hourOptions: ['09:00', '10:00', '11:00', '12:00', '13:00'],
    isEndTimeDisabled: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with correct structure', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
    expect(screen.getByTestId('form-label')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toBeInTheDocument();
  });
  it('displays the correct label text', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(screen.getByTestId('form-label')).toHaveTextContent('дуусах цаг*');
  });
  it('displays the correct placeholder text', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(screen.getByTestId('select-value')).toHaveTextContent('Дуусах цаг');
  });
  it('applies correct CSS classes', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(screen.getByTestId('form-item')).toHaveClass('flex', 'flex-col');
    expect(screen.getByTestId('select-trigger')).toHaveClass('w-[140px]');
  });
  it('passes the current endHour value to Select', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(screen.getByTestId('select')).toHaveAttribute('data-value', '10:00');
  });
  it('renders all hour options as SelectItems', () => {
    render(<SelectEndHour {...defaultProps} />);
    defaultProps.hourOptions.forEach((hour) => {
      const item = screen.getByTestId(`select-hour-${hour}`);
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('value', hour);
      expect(item).toHaveTextContent(hour);
    });
  });
  it('calls isEndTimeDisabled for each hour option', () => {
    render(<SelectEndHour {...defaultProps} />);
    expect(defaultProps.isEndTimeDisabled).toHaveBeenCalledTimes(5);
    defaultProps.hourOptions.forEach((hour) => {
      expect(defaultProps.isEndTimeDisabled).toHaveBeenCalledWith(hour);
    });
  });
  it('disables hours that are before or equal to start hour', () => {
    const mockIsDisabled = jest.fn((endTime) => endTime <= '10:00');
    const props = { ...defaultProps, isEndTimeDisabled: mockIsDisabled };
    render(<SelectEndHour {...props} />);
    expect(screen.getByTestId('select-hour-09:00')).toBeDisabled();
    expect(screen.getByTestId('select-hour-10:00')).toBeDisabled();
    expect(screen.getByTestId('select-hour-11:00')).not.toBeDisabled();
    expect(screen.getByTestId('select-hour-12:00')).not.toBeDisabled();
    expect(screen.getByTestId('select-hour-13:00')).not.toBeDisabled();
  });
  it('enables all hours when no start hour restriction', () => {
    const mockIsDisabled = jest.fn(() => false);
    const props = { ...defaultProps, isEndTimeDisabled: mockIsDisabled };
    render(<SelectEndHour {...props} />);
    defaultProps.hourOptions.forEach((hour) => {
      expect(screen.getByTestId(`select-hour-${hour}`)).not.toBeDisabled();
    });
  });
  it('handles different start hour scenarios', () => {
    const mockIsDisabled = jest.fn((endTime) => endTime <= '11:00');
    const props = { ...defaultProps, isEndTimeDisabled: mockIsDisabled };
    render(<SelectEndHour {...props} />);
    expect(screen.getByTestId('select-hour-09:00')).toBeDisabled();
    expect(screen.getByTestId('select-hour-10:00')).toBeDisabled();
    expect(screen.getByTestId('select-hour-11:00')).toBeDisabled();
    expect(screen.getByTestId('select-hour-12:00')).not.toBeDisabled();
    expect(screen.getByTestId('select-hour-13:00')).not.toBeDisabled();
  });
  it('handles empty hourOptions array', () => {
    const props = { ...defaultProps, hourOptions: [] };
    render(<SelectEndHour {...props} />);
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
    expect(defaultProps.isEndTimeDisabled).not.toHaveBeenCalled();
  });
  it('works with different endHour values', () => {
    const props = { ...defaultProps, endHour: '12:00' };
    render(<SelectEndHour {...props} />);
    expect(screen.getByTestId('select')).toHaveAttribute('data-value', '12:00');
  });
  it('maintains component structure with large hourOptions array', () => {
    const largeHourOptions = Array.from({ length: 24 }, (_, i) => 
      `${String(i).padStart(2, '0')}:00`
    );
    const props = { ...defaultProps, hourOptions: largeHourOptions };
    render(<SelectEndHour {...props} />);
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
    expect(defaultProps.isEndTimeDisabled).toHaveBeenCalledTimes(24);
  });
});