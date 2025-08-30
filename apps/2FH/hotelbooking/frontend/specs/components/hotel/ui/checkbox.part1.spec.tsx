import React from 'react';
import { render, screen } from '@testing-library/react';
import { Checkbox } from '../../../../src/components/ui/Checkbox';

jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix UI Checkbox
jest.mock('@radix-ui/react-checkbox', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const Root = React.forwardRef(
    ({ children, className, checked, disabled, required, id, name, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby, onChange, onCheckedChange, onFocus, ...props }: any, ref: any) => (
      <div
        ref={ref}
        data-testid="checkbox-root"
        className={className}
        role="checkbox"
        tabIndex={0}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled ? 'disabled' : undefined}
        required={required ? 'required' : undefined}
        id={id}
        name={name}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        onClick={(e) => {
          if (onChange) onChange(e);
          if (onCheckedChange) onCheckedChange(!checked);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onChange) onChange(e);
        }}
        onFocus={onFocus}
        {...props}
      >
        {children}
      </div>
    )
  );
  Root.displayName = 'Root';

  const Indicator = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="checkbox-indicator" className={className} {...props}>
      {children}
    </div>
  ));
  Indicator.displayName = 'Indicator';

  return {
    Root,
    Indicator,
  };
});
jest.mock('lucide-react', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const Check = React.forwardRef(({ className }: { className: string }, ref: any) => (
    <div data-testid="check-icon" className={className} ref={ref}>
      ✓
    </div>
  ));
  Check.displayName = 'Check';

  return {
    Check,
  };
});

describe('checkbox - Part 1', () => {
  it('renders with default props', () => {
    render(<Checkbox />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass(
      'peer',
      'h-4',
      'w-4',
      'shrink-0',
      'rounded-sm',
      'border',
      'border-primary',
      'ring-offset-background',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'data-[state=checked]:bg-primary',
      'data-[state=checked]:text-primary-foreground'
    );
  });

  it('renders with custom className', () => {
    render(<Checkbox className="custom-class" />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('renders with indicator and check icon', () => {
    render(<Checkbox />);

    const indicator = screen.getByTestId('checkbox-indicator');
    const checkIcon = screen.getByTestId('check-icon');

    expect(indicator).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
    expect(indicator).toHaveClass('flex', 'items-center', 'justify-center', 'text-current');
    expect(checkIcon).toHaveClass('w-4', 'h-4');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Checkbox ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId('checkbox-root'));
  });

  it('forwards additional props', () => {
    render(<Checkbox checked={true} disabled={true} required={true} id="test-id" name="test-name" aria-label="test-label" aria-describedby="test-describedby" className="test-class" />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('disabled');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox).toHaveAttribute('required');
    expect(checkbox).toHaveAttribute('id', 'test-id');
    expect(checkbox).toHaveAttribute('name', 'test-name');
    expect(checkbox).toHaveAttribute('aria-label', 'test-label');
    expect(checkbox).toHaveAttribute('aria-describedby', 'test-describedby');
    expect(checkbox).toHaveClass('test-class');
  });

  it('handles checked state', () => {
    render(<Checkbox checked={true} />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });
});
