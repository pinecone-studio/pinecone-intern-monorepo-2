import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../../../src/components/ui/Badge';

// Mock the cn utility function
jest.mock('../../../../src/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2'
    );
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80');
  });

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText('Secondary Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
  });

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText('Destructive Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80');
  });

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText('Outline Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);

    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    render(
      <Badge
        data-testid="test-badge"
        onClick={() => {
          /* empty function for testing */
        }}
      >
        Test Badge
      </Badge>
    );

    const badge = screen.getByTestId('test-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-testid', 'test-badge');
  });

  it('renders with children content', () => {
    render(<Badge>Badge with content</Badge>);

    expect(screen.getByText('Badge with content')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('combines variant and custom className', () => {
    render(
      <Badge variant="secondary" className="my-custom-class">
        Combined Badge
      </Badge>
    );

    const badge = screen.getByText('Combined Badge');
    expect(badge).toHaveClass('my-custom-class');
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
  });

  it('renders with all HTML attributes', () => {
    render(
      <Badge id="test-id" title="Test title" aria-label="Test aria label" role="status">
        Accessible Badge
      </Badge>
    );

    const badge = screen.getByText('Accessible Badge');
    expect(badge).toHaveAttribute('id', 'test-id');
    expect(badge).toHaveAttribute('title', 'Test title');
    expect(badge).toHaveAttribute('aria-label', 'Test aria label');
    expect(badge).toHaveAttribute('role', 'status');
  });
});
