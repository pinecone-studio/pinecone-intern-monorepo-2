import React from 'react';
import { render, screen } from '@testing-library/react';
import { SwipeOverlay } from '../components/swipe/SwipeOverlay';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('SwipeOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Left direction overlay', () => {
    const leftProps = {
      direction: 'left' as const,
      opacity: 0.8,
    };

    it('renders left direction overlay correctly', () => {
      render(<SwipeOverlay {...leftProps} />);
      
      expect(screen.getByText('NOPE')).toBeInTheDocument();
    });

    it('applies correct left direction styling', () => {
      render(<SwipeOverlay {...leftProps} />);
      
      const overlay = screen.getByText('NOPE').closest('div');
      expect(overlay).toHaveClass('bg-red-500/20');
    });

    it('applies correct left direction positioning', () => {
      render(<SwipeOverlay {...leftProps} />);
      
      const badge = screen.getByText('NOPE');
      expect(badge).toHaveClass('left-8', '-rotate-12');
    });

    it('applies correct left direction colors', () => {
      render(<SwipeOverlay {...leftProps} />);
      
      const badge = screen.getByText('NOPE');
      expect(badge).toHaveClass('border-red-500', 'text-red-500');
    });
  });

  describe('Right direction overlay', () => {
    const rightProps = {
      direction: 'right' as const,
      opacity: 0.6,
    };

    it('renders right direction overlay correctly', () => {
      render(<SwipeOverlay {...rightProps} />);
      
      expect(screen.getByText('LIKE')).toBeInTheDocument();
    });

    it('applies correct right direction styling', () => {
      render(<SwipeOverlay {...rightProps} />);
      
      const overlay = screen.getByText('LIKE').closest('div');
      expect(overlay).toHaveClass('bg-green-500/20');
    });

    it('applies correct right direction positioning', () => {
      render(<SwipeOverlay {...rightProps} />);
      
      const badge = screen.getByText('LIKE');
      expect(badge).toHaveClass('right-8', 'rotate-12');
    });

    it('applies correct right direction colors', () => {
      render(<SwipeOverlay {...rightProps} />);
      
      const badge = screen.getByText('LIKE');
      expect(badge).toHaveClass('border-green-500', 'text-green-500');
    });
  });

  describe('Common functionality', () => {
    it('renders without crashing', () => {
      expect(() => render(<SwipeOverlay direction="left" opacity={0.5} />)).not.toThrow();
    });

    it('applies correct container styling', () => {
      render(<SwipeOverlay direction="left" opacity={0.5} />);
      
      const container = screen.getByText('NOPE').closest('div');
      expect(container).toHaveClass('absolute', 'inset-0');
    });

    it('applies correct badge styling', () => {
      render(<SwipeOverlay direction="left" opacity={0.5} />);
      
      const badge = screen.getByText('NOPE');
      expect(badge).toHaveClass(
        'absolute', 'top-12', 'left-8', 'bg-transparent', 'border-4', 
        'border-red-500', 'text-red-500', 'px-6', 'py-3', 'rounded-lg', 
        'font-black', 'text-2xl', 'transform', '-rotate-12'
      );
    });

    it('handles different opacity values', () => {
      const { rerender } = render(<SwipeOverlay direction="left" opacity={0.3} />);
      
      let overlay = screen.getByText('NOPE').closest('div');
      expect(overlay).toBeInTheDocument();
      
      rerender(<SwipeOverlay direction="left" opacity={0.9} />);
      overlay = screen.getByText('NOPE').closest('div');
      expect(overlay).toBeInTheDocument();
    });

    it('maintains consistent layout structure', () => {
      const { container } = render(<SwipeOverlay direction="left" opacity={0.5} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      const overlayDiv = mainContainer?.firstChild as HTMLElement;
      const badge = overlayDiv?.lastChild as HTMLElement;
      
      expect(mainContainer).toHaveClass('absolute', 'inset-0');
      expect(overlayDiv).toHaveClass('absolute', 'inset-0', 'bg-red-500/20');
      expect(badge).toHaveClass('absolute', 'top-12', 'left-8');
    });

    it('handles edge case opacity values', () => {
      expect(() => render(<SwipeOverlay direction="left" opacity={0} />)).not.toThrow();
      expect(() => render(<SwipeOverlay direction="left" opacity={1} />)).not.toThrow();
      expect(() => render(<SwipeOverlay direction="left" opacity={0.999} />)).not.toThrow();
    });

    it('renders both directions correctly', () => {
      const { rerender } = render(<SwipeOverlay direction="left" opacity={0.5} />);
      expect(screen.getByText('NOPE')).toBeInTheDocument();
      
      rerender(<SwipeOverlay direction="right" opacity={0.5} />);
      expect(screen.getByText('LIKE')).toBeInTheDocument();
    });
  });

  describe('Accessibility and semantics', () => {
    it('has correct text content for screen readers', () => {
      render(<SwipeOverlay direction="left" opacity={0.5} />);
      
      const badge = screen.getByText('NOPE');
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toBe('NOPE');
    });

    it('maintains proper contrast with background', () => {
      render(<SwipeOverlay direction="left" opacity={0.5} />);
      
      const badge = screen.getByText('NOPE');
      expect(badge).toHaveClass('text-red-500', 'border-red-500');
    });
  });
});
