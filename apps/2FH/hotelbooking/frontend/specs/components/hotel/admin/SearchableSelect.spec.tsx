import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { SearchableSelect } from '@/components/admin/FilterControls';

// Mock the cmdk components to avoid scrollIntoView issues
jest.mock('@/components/ui/command', () => ({
  Command: ({ children }: { children: React.ReactNode }) => <div data-testid="command">{children}</div>,
  CommandEmpty: ({ children }: { children: React.ReactNode }) => <div data-testid="command-empty">{children}</div>,
  CommandGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="command-group">{children}</div>,
  CommandInput: ({ placeholder }: { placeholder: string }) => <input data-testid="command-input" placeholder={placeholder} />,
  CommandItem: ({ children, value, onSelect }: { children: React.ReactNode; value: string; onSelect: (_value: string) => void }) => (
    <div data-testid={`command-item-${value}`} onClick={() => onSelect(value)}>
      {children}
    </div>
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => <div data-testid="command-list">{children}</div>,
}));

// Mock the Popover components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open, _onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (_open: boolean) => void }) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ children, asChild: _asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div
      data-testid="popover-trigger"
      onClick={() => {
        /* empty function for testing */
      }}
    >
      {children}
    </div>
  ),
}));

describe('SearchableSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    value: '',
    onValueChange: jest.fn(),
    placeholder: 'Select an option',
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no value is selected', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders selected option label when value is provided', () => {
    render(<SearchableSelect {...defaultProps} value="option1" />);
    expect(screen.getAllByText('Option 1')[0]).toBeInTheDocument();
  });

  it('renders popover components', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
  });

  it('renders command components when popover is open', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByTestId('command')).toBeInTheDocument();
    expect(screen.getByTestId('command-input')).toBeInTheDocument();
    expect(screen.getByTestId('command-list')).toBeInTheDocument();
    expect(screen.getByTestId('command-group')).toBeInTheDocument();
  });

  it('renders all options as command items', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByTestId('command-item-option1')).toBeInTheDocument();
    expect(screen.getByTestId('command-item-option2')).toBeInTheDocument();
    expect(screen.getByTestId('command-item-option3')).toBeInTheDocument();
  });

  it('calls onValueChange when option is clicked', () => {
    const onValueChange = jest.fn();
    render(<SearchableSelect {...defaultProps} onValueChange={onValueChange} />);

    const option = screen.getByTestId('command-item-option1');
    fireEvent.click(option);

    expect(onValueChange).toHaveBeenCalledWith('option1');
  });

  it('deselects option when same option is clicked again', () => {
    const onValueChange = jest.fn();
    render(<SearchableSelect {...defaultProps} value="option1" onValueChange={onValueChange} />);

    const option = screen.getByTestId('command-item-option1');
    fireEvent.click(option);

    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('uses custom search placeholder', () => {
    render(<SearchableSelect {...defaultProps} searchPlaceholder="Custom search..." />);
    expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', 'Custom search...');
  });

  it('shows check icon for selected option', () => {
    render(<SearchableSelect {...defaultProps} value="option1" />);
    const checkIcon = screen.getByTestId('check-icon-option1');
    expect(checkIcon).toHaveClass('opacity-100');
  });

  it('shows transparent check icon for unselected options', () => {
    render(<SearchableSelect {...defaultProps} value="option1" />);
    const checkIcon = screen.getByTestId('check-icon-option2');
    expect(checkIcon).toHaveClass('opacity-0');
  });
}); 