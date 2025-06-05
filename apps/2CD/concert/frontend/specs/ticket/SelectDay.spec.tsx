import { render, screen } from '@testing-library/react';
import { SelectDay } from '@/app/(admin)/ticket/_components';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'PPP') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toString();
  }),
}));
jest.mock('lucide-react', () => ({
  CalendarIcon: (props:any) => <svg {...props} data-testid="calendar-icon">CalendarIcon</svg>,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, 'data-testid': testId, ...props }: any) => (
    <button onClick={onClick} data-testid={testId} {...props}>
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/form', () => ({
  FormControl: ({ children, ...props }:{children: ReactNode}) => <div data-testid="form-control" {...props}>{children}</div>,
  FormItem: ({ children, ...props }:{children: ReactNode}) => <div data-testid="form-item" {...props}>{children}</div>,
  FormLabel: ({ children, ...props }:{children: ReactNode}) => <label data-testid="form-label" {...props}>{children}</label>,
  FormMessage: ({ ...props }) => <div {...props} data-testid="form-message"></div>,
}));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, ...props }: { children: ReactNode; variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null | undefined }) => (
    <button {...props} data-variant={variant}>
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/calendar', () => {
  const getDisabledState = (disabled : any) => {
    if (!disabled || typeof disabled !== 'function') return { hasDisabled: 'false', pastDisabled: 'false', futureDisabled: 'false' };
    const pastDate = new Date('2020-01-01');
    const futureDate = new Date('2030-01-01');
    return {
      hasDisabled: 'true',
      pastDisabled: disabled(pastDate).toString(),
      futureDisabled: disabled(futureDate).toString()
    };
  };
  return {
    Calendar: ({ mode, selected, onSelect, disabled, initialFocus, ...props }:any) => {
      const disabledState = getDisabledState(disabled);
      return (
        <div 
          {...props} 
          data-mode={mode}
          data-selected={selected ? selected.toISOString() : 'undefined'}
          data-onselect={onSelect ? 'true' : 'false'}
          data-disabled={disabledState.hasDisabled}
          data-initialfocus={initialFocus ? 'true' : 'false'}
          data-disabled-past={disabledState.pastDisabled}
          data-disabled-future={disabledState.futureDisabled}
        >
          Calendar Component
        </div>
      );
    },
  };
});
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  PopoverContent: ({ children, align, ...props }: { children: ReactNode; align: 'center' | 'end' | 'start' }) => (
    <div {...props} data-align={align}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children, asChild, ...props }: any) => (
    <div {...props} data-aschild={asChild ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));
describe('SelectDay', () => {
  const defaultProps = {
    day: undefined,
    setDay: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('displays placeholder text when no date is selected', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('pick-date')).toBeInTheDocument();
  });
  it('displays formatted date when day is selected', () => {
    const selectedDate = new Date('2024-12-25');
    const props = { ...defaultProps, day: selectedDate };
    render(<SelectDay {...props} />);
    expect(screen.queryByText('Pick a date')).not.toBeInTheDocument();
    expect(screen.getByText('Wednesday, December 25, 2024')).toBeInTheDocument();
  });
  it('renders calendar icon with correct styling', () => {
    render(<SelectDay {...defaultProps} />);
    const calendarIcon = screen.getByTestId('calendar-icon');
    expect(calendarIcon).toBeInTheDocument();
    expect(calendarIcon).toHaveClass('ml-auto', 'h-4', 'w-4', 'opacity-50');
  });
  it('configures button with correct variant', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('open-calendar-btn')).toHaveAttribute('data-variant', 'outline');
  });
  it('configures popover trigger with asChild prop', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('popover-trigger')).toHaveAttribute('data-aschild', 'true');
  });
  it('configures popover content with correct alignment', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-align', 'start');
  });
  it('configures calendar with correct props', () => {
    const selectedDate = new Date('2024-12-25');
    const props = { ...defaultProps, day: selectedDate };
    render(<SelectDay {...props} />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-mode', 'single');
    expect(calendar).toHaveAttribute('data-selected', selectedDate.toISOString());
    expect(calendar).toHaveAttribute('data-onselect', 'true');
    expect(calendar).toHaveAttribute('data-disabled', 'true');
    expect(calendar).toHaveAttribute('data-initialfocus', 'true');
  });
  it('passes setDay function to calendar onSelect', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('calendar')).toHaveAttribute('data-onselect', 'true');
  });
  it('handles undefined day prop correctly', () => {
    render(<SelectDay {...defaultProps} />);
    expect(screen.getByTestId('calendar')).toHaveAttribute('data-selected', undefined);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });
  it('formats different dates correctly', () => {
    const testDate = new Date('2023-01-01');
    const props = { ...defaultProps, day: testDate };
    render(<SelectDay {...props} />);
    expect(screen.getByText('Sunday, January 1, 2023')).toBeInTheDocument();
  });
 it('maintains component structure when day changes', () => {
    const { rerender } = render(<SelectDay {...defaultProps} />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
    const newProps = { ...defaultProps, day: new Date('2024-06-15') };
    rerender(<SelectDay {...newProps} />);
    expect(screen.queryByText('Pick a date')).not.toBeInTheDocument();
    expect(screen.getByText('Saturday, June 15, 2024')).toBeInTheDocument();
    expect(screen.getByTestId('form-item')).toBeInTheDocument();
  });
});