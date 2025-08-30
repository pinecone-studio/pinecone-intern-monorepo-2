import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { Label } from '../../../../src/components/ui/Label';

// Mock the cn utility function
jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Label', () => {
  it('renders with default props', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });

  it('renders with custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>);

    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-class');
  });

  it('renders with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Input Label</Label>);

    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);

    expect(ref.current).toBe(screen.getByText('Ref Label'));
  });

  it('forwards additional props', () => {
    render(
      <Label data-testid="custom-label" id="test-id">
        Test Label
      </Label>
    );

    const label = screen.getByTestId('custom-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('id', 'test-id');
  });

  it('renders with children content', () => {
    render(<Label>Label with content</Label>);

    expect(screen.getByText('Label with content')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <Label>
        <span>Icon</span>
        <span>Text</span>
      </Label>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    render(<Label />);

    const label = screen.getByRole('generic');
    expect(label).toBeInTheDocument();
  });

  it('combines className with default classes', () => {
    render(<Label className="my-custom-class">Combined Label</Label>);

    const label = screen.getByText('Combined Label');
    expect(label).toHaveClass('my-custom-class');
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });

  it('renders with all HTML attributes', () => {
    render(
      <Label htmlFor="test-input" id="test-id" title="Test title" aria-label="Test aria label">
        Accessible Label
      </Label>
    );

    const label = screen.getByText('Accessible Label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(label).toHaveAttribute('id', 'test-id');
    expect(label).toHaveAttribute('title', 'Test title');
    expect(label).toHaveAttribute('aria-label', 'Test aria label');
  });

  it('handles multiple props together', () => {
    render(
      <Label htmlFor="input" className="test-class" data-testid="test-label">
        Multiple Props Label
      </Label>
    );

    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('for', 'input');
    expect(label).toHaveClass('test-class');
    expect(label).toHaveTextContent('Multiple Props Label');
  });

  it('renders with special characters in text', () => {
    render(<Label>Label with special chars: &amp; &lt; &gt; &quot; &apos;</Label>);

    expect(screen.getByText('Label with special chars: & < > " \'')).toBeInTheDocument();
  });

  it('renders with unicode characters', () => {
    render(<Label>Label with unicode: 🏨 🏪 🏫</Label>);

    expect(screen.getByText('Label with unicode: 🏨 🏪 🏫')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Label onClick={handleClick}>Clickable Label</Label>);

    const label = screen.getByText('Clickable Label');
    fireEvent.click(label);

    expect(handleClick).toHaveBeenCalled();
  });

  it('handles mouse events', () => {
    const handleMouseEnter = jest.fn();
    render(<Label onMouseEnter={handleMouseEnter}>Hoverable Label</Label>);

    const label = screen.getByText('Hoverable Label');
    fireEvent.mouseEnter(label);

    expect(handleMouseEnter).toHaveBeenCalled();
  });
});
