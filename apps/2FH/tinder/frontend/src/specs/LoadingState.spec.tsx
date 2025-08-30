import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../components/swipe/LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner correctly', () => {
    render(<LoadingState />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-32', 'w-32', 'border-b-2', 'border-red-500');
  });

  it('renders loading text correctly', () => {
    render(<LoadingState />);
    
    expect(screen.getByText('Profiles ачаалж байна...')).toBeInTheDocument();
  });

  it('applies correct container styling', () => {
    render(<LoadingState />);
    
    const container = screen.getByText('Profiles ачаалж байна...').closest('div');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
  });

  it('applies correct text container styling', () => {
    render(<LoadingState />);
    
    const textContainer = screen.getByText('Profiles ачаалж байна...').closest('div');
    expect(textContainer).toHaveClass('text-center');
  });

  it('applies correct text styling', () => {
    render(<LoadingState />);
    
    const loadingText = screen.getByText('Profiles ачаалж байна...');
    expect(loadingText).toHaveClass('mt-4', 'text-gray-600');
  });

  it('renders without crashing', () => {
    expect(() => render(<LoadingState />)).not.toThrow();
  });

  it('has correct accessibility attributes', () => {
    render(<LoadingState />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('maintains consistent layout structure', () => {
    const { container } = render(<LoadingState />);
    
    const mainContainer = container.firstChild as HTMLElement;
    const textContainer = mainContainer?.firstChild as HTMLElement;
    const spinner = textContainer?.firstChild as HTMLElement;
    const text = textContainer?.lastChild as HTMLElement;
    
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
    expect(textContainer).toHaveClass('text-center');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-32', 'w-32', 'border-b-2', 'border-red-500');
    expect(text).toHaveClass('mt-4', 'text-gray-600');
  });
});
