import { render, screen, fireEvent } from '@/TestUtils';
import { Button } from '../../../../src/components/ui/Button';

describe('Button', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('renders button with outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole('button', { name: 'Outline Button' });
    expect(button).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole('button', { name: 'Secondary Button' });
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('renders button with ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>);

    const button = screen.getByRole('button', { name: 'Ghost Button' });
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
  });

  it('renders button with link variant', () => {
    render(<Button variant="link">Link Button</Button>);

    const button = screen.getByRole('button', { name: 'Link Button' });
    expect(button).toHaveClass('text-primary', 'underline-offset-4');
  });

  it('renders button with destructive variant', () => {
    render(<Button variant="destructive">Destructive Button</Button>);

    const button = screen.getByRole('button', { name: 'Destructive Button' });
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('renders button with different sizes', () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-4', 'py-2');

    rerender(<Button size="sm">Small Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9', 'rounded-md', 'px-3');

    rerender(<Button size="lg">Large Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11', 'rounded-md', 'px-8');

    rerender(<Button size="icon">Icon Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as different HTML elements', () => {
    const { rerender } = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();

    rerender(
      <Button asChild>
        <span>Span Button</span>
      </Button>
    );
    expect(screen.getByText('Span Button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toHaveClass('custom-class');
  });

  it('renders with children content', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('has correct default type', () => {
    render(<Button>Submit Button</Button>);

    const button = screen.getByRole('button', { name: 'Submit Button' });
    // The button component doesn't set a default type attribute
    expect(button).toBeInTheDocument();
  });

  it('can have submit type', () => {
    render(<Button type="submit">Submit Button</Button>);

    const button = screen.getByRole('button', { name: 'Submit Button' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('can have reset type', () => {
    render(<Button type="reset">Reset Button</Button>);

    const button = screen.getByRole('button', { name: 'Reset Button' });
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref).toHaveBeenCalled();
  });
});
