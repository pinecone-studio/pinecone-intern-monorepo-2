import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('checkbox - Part 2', () => {
  it('handles unchecked state', () => {
    render(<Checkbox checked={false} />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles disabled state', () => {
    render(<Checkbox disabled={true} />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('disabled');
  });

  it('handles required state', () => {
    render(<Checkbox required={true} />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('required');
  });

  it('handles multiple props together', () => {
    render(<Checkbox checked={true} disabled={true} required={true} className="test-class" />);

    const checkbox = screen.getByTestId('checkbox-root');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox).toHaveAttribute('disabled');
    expect(checkbox).toHaveAttribute('required');
    expect(checkbox).toHaveClass('test-class');
  });

  it('handles keyboard events', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByTestId('checkbox-root');
    fireEvent.keyDown(checkbox, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles focus events', () => {
    const handleFocus = jest.fn();
    render(<Checkbox onFocus={handleFocus} />);

    const checkbox = screen.getByTestId('checkbox-root');
    fireEvent.focus(checkbox);

    expect(handleFocus).toHaveBeenCalled();
  });
});
