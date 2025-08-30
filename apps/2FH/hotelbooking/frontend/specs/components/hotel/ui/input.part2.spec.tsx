import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../../src/components/ui/Input';

jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Input', () => {
  describe('input - Part 2', () => {
    it('handles onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBe(screen.getByRole('textbox'));
    });

    it('forwards additional props', () => {
      render(<Input data-testid="custom-input" id="test-id" name="test-name" />);

      const input = screen.getByTestId('custom-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-id');
      expect(input).toHaveAttribute('name', 'test-name');
    });

    it('renders with aria attributes', () => {
      render(<Input aria-label="Test input" aria-describedby="description" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Test input');
      expect(input).toHaveAttribute('aria-describedby', 'description');
    });

    it('renders with min and max attributes', () => {
      render(<Input type="number" min="0" max="100" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('renders with step attribute', () => {
      render(<Input type="number" step="0.1" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.1');
    });

    it('combines className with default classes', () => {
      render(<Input className="my-custom-class" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('my-custom-class');
      expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background');
    });

    it('handles multiple props together', () => {
      render(
        <Input
          value="test"
          disabled
          required
          className="test-class"
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('required');
      expect(input).toHaveClass('test-class');
    });

    it('renders with different input types', () => {
      const { rerender } = render(<Input type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

      rerender(<Input type="search" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');

      rerender(<Input type="tel" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });
  });
});
