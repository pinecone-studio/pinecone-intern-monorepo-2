import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { Textarea } from '../../../../src/components/ui/Textarea';

jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Textarea', () => {
  describe('textarea - Part 1', () => {
    it('renders with default props', () => {
      render(<Textarea />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveClass(
        'flex',
        'min-h-[80px]',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-background',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    it('renders with custom className', () => {
      render(<Textarea className="custom-class" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-class');
    });

    it('renders with value', () => {
      render(
        <Textarea
          value="test value"
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('test value');
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter text..." />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder', 'Enter text...');
    });

    it('renders with disabled state', () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('renders with required attribute', () => {
      render(<Textarea required />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('required');
    });

    it('renders with rows attribute', () => {
      render(<Textarea rows={5} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('renders with cols attribute', () => {
      render(<Textarea cols={50} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });

    it('handles onChange event', () => {
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Textarea onFocus={handleFocus} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.focus(textarea);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Textarea onBlur={handleBlur} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.blur(textarea);

      expect(handleBlur).toHaveBeenCalled();
    });
  });
});
