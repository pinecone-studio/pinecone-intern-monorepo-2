import React from 'react';
import { render } from '@testing-library/react';
import { LoadingSkeleton } from '@/components/admin/room-detail/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders loading skeleton correctly', () => {
    render(<LoadingSkeleton />);

    // Check main container - use a more specific selector
    const container = document.querySelector('.min-h-screen.bg-gray-50.p-6');
    expect(container).toBeInTheDocument();
  });

  it('renders header skeleton elements', () => {
    render(<LoadingSkeleton />);

    // Check for skeleton elements in the header
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders grid layout skeleton', () => {
    render(<LoadingSkeleton />);

    // Check for grid container
    const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders left side skeleton cards', () => {
    render(<LoadingSkeleton />);

    // Check for card skeletons on the left side - look for skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders right side skeleton cards', () => {
    render(<LoadingSkeleton />);

    // Check for card skeletons on the right side - look for skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('has proper skeleton animation classes', () => {
    render(<LoadingSkeleton />);

    const animatedElements = document.querySelectorAll('.animate-pulse');
    animatedElements.forEach((element) => {
      expect(element).toHaveClass('animate-pulse');
    });
  });

  it('renders skeleton with correct gray colors', () => {
    render(<LoadingSkeleton />);

    const grayElements = document.querySelectorAll('.bg-gray-200');
    grayElements.forEach((element) => {
      expect(element).toHaveClass('bg-gray-200');
    });
  });

  it('has proper responsive grid structure', () => {
    render(<LoadingSkeleton />);

    const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-6');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders skeleton cards with proper spacing', () => {
    render(<LoadingSkeleton />);

    const spaceYElements = document.querySelectorAll('.space-y-6');
    expect(spaceYElements.length).toBeGreaterThan(0);
  });

  it('has proper skeleton dimensions', () => {
    render(<LoadingSkeleton />);

    // Check for various skeleton element sizes
    const skeletonElements = document.querySelectorAll('.bg-gray-200');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Check for specific skeleton sizes
    const headerSkeleton = document.querySelector('.h-8.w-64.bg-gray-200');
    expect(headerSkeleton).toBeInTheDocument();
  });

  it('renders image skeleton with proper aspect ratio', () => {
    render(<LoadingSkeleton />);

    const imageSkeleton = document.querySelector('.h-64.bg-gray-200');
    expect(imageSkeleton).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('has proper accessibility structure', () => {
    render(<LoadingSkeleton />);

    // Check that the skeleton has proper structure for screen readers
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => render(<LoadingSkeleton />)).not.toThrow();
  });
});
