import React from 'react';
import { render, screen } from '@/TestUtils';
import { Textarea } from '../../../../src/components/ui/Textarea';

jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Textarea', () => {
  describe('textarea - Part 2', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);

      expect(ref.current).toBe(screen.getByRole('textbox'));
    });

    it('forwards additional props', () => {
      render(<Textarea data-testid="custom-textarea" id="test-id" name="test-name" />);

      const textarea = screen.getByTestId('custom-textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('id', 'test-id');
      expect(textarea).toHaveAttribute('name', 'test-name');
    });

    it('renders with aria attributes', () => {
      render(<Textarea aria-label="Test textarea" aria-describedby="description" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Test textarea');
      expect(textarea).toHaveAttribute('aria-describedby', 'description');
    });

    it('renders with maxLength attribute', () => {
      render(<Textarea maxLength={100} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('renders with minLength attribute', () => {
      render(<Textarea minLength={10} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('minLength', '10');
    });

    it('renders with readOnly attribute', () => {
      render(<Textarea readOnly />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readOnly');
    });

    it('combines className with default classes', () => {
      render(<Textarea className="my-custom-class" />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('my-custom-class');
      expect(textarea).toHaveClass('flex', 'min-h-[80px]', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background');
    });

    it('handles multiple props together', () => {
      render(
        <Textarea
          value="test"
          disabled
          required
          className="test-class"
          rows={3}
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('test');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('required');
      expect(textarea).toHaveClass('test-class');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('renders with long text content', () => {
      const longText = 'This is a very long text that should be displayed in the textarea. '.repeat(10);
      render(
        <Textarea
          value={longText}
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(longText);
    });

    it('renders with multiline text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      render(
        <Textarea
          value={multilineText}
          onChange={() => {
            /* empty function for testing */
          }}
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(multilineText);
    });
    it('handles resize attribute', () => {
      render(<Textarea style={{ resize: 'vertical' }} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveStyle({ resize: 'vertical' });
    });
  });
});
