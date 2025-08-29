import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../../src/components/ui/Input';

jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Input', () => {
  describe('input - Part 1', () => {
    it('renders with default props', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-background',
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    it('renders with custom className', () => {
      render(<Input className="custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('renders with value', () => {
      render(
        <Input
          value="test value"
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text..." />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text...');
    });

    it('renders with type attribute', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders with disabled state', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('renders with required attribute', () => {
      render(<Input required />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });

    it('handles onChange event', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalled();
    });
  });
});
