import { render, screen } from '@testing-library/react';
import { HotelSkeleton, HotelSkeletonGrid, HotelSkeletonHorizontal } from '@/components/landing-page/HotelSkeleton';

describe('HotelSkeleton', () => {
  it('renders without crashing', () => {
    render(<HotelSkeleton />);
    expect(screen.getByTestId('hotel-skeleton')).toBeInTheDocument();
  });

  it('has correct base styling classes', () => {
    render(<HotelSkeleton />);
    const container = screen.getByTestId('hotel-skeleton');
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'animate-pulse');
  });

  it('renders image placeholder with correct dimensions', () => {
    render(<HotelSkeleton />);
    const imagePlaceholder = screen.getByTestId('hotel-skeleton').querySelector('.h-48');
    expect(imagePlaceholder).toHaveClass('bg-gray-300');
  });

  it('renders title skeleton with correct styling', () => {
    render(<HotelSkeleton />);
    const titleSkeleton = screen.getByTestId('hotel-skeleton').querySelector('.h-5');
    expect(titleSkeleton).toHaveClass('bg-gray-300', 'rounded', 'mb-2', 'w-3/4');
  });

  it('renders subtitle skeleton with correct styling', () => {
    render(<HotelSkeleton />);
    const subtitleSkeleton = screen.getByTestId('hotel-skeleton').querySelector('.h-4.bg-gray-300.rounded.mb-3');
    expect(subtitleSkeleton).toBeInTheDocument();
    // Check for the w-1/2 class separately since it contains a forward slash
    expect(subtitleSkeleton).toHaveClass('w-1/2');
  });

  it('renders star rating skeleton with 5 stars', () => {
    render(<HotelSkeleton />);
    const starContainer = screen.getByTestId('hotel-skeleton').querySelector('.flex.gap-1');
    const stars = starContainer?.querySelectorAll('.w-4.h-4.bg-gray-300.rounded');
    expect(stars).toHaveLength(5);
  });

  it('renders rating text skeleton', () => {
    render(<HotelSkeleton />);
    const ratingSkeleton = screen.getByTestId('hotel-skeleton').querySelector('.ml-2.h-4.bg-gray-300.rounded.w-16');
    expect(ratingSkeleton).toBeInTheDocument();
  });

  it('renders amenities skeleton with 3 items', () => {
    render(<HotelSkeleton />);
    const amenitiesContainer = screen.getByTestId('hotel-skeleton').querySelector('.space-y-2.mb-4');
    const amenityItems = amenitiesContainer?.querySelectorAll('.flex.items-center.gap-2');
    expect(amenityItems).toHaveLength(3);
  });

  it('renders button skeleton with correct styling', () => {
    render(<HotelSkeleton />);
    const buttonSkeleton = screen.getByTestId('hotel-skeleton').querySelector('.h-8.bg-gray-300.rounded-full.w-20');
    expect(buttonSkeleton).toBeInTheDocument();
  });
});

describe('HotelSkeletonGrid', () => {
  it('renders with default count of 4', () => {
    render(<HotelSkeletonGrid />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('renders with custom count', () => {
    render(<HotelSkeletonGrid count={6} />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(6);
  });

  it('has correct grid layout classes', () => {
    render(<HotelSkeletonGrid />);
    const gridContainer = screen.getByTestId('hotel-skeleton-grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  it('renders unique keys for each skeleton', () => {
    render(<HotelSkeletonGrid count={3} />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(3);
  });
});

describe('HotelSkeletonHorizontal', () => {
  it('renders with default count of 4', () => {
    render(<HotelSkeletonHorizontal />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(4);
  });

  it('renders with custom count', () => {
    render(<HotelSkeletonHorizontal count={8} />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(8);
  });

  it('has correct grid layout classes', () => {
    render(<HotelSkeletonHorizontal />);
    const gridContainer = screen.getByTestId('hotel-skeleton-horizontal');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  it('renders unique keys for each skeleton', () => {
    render(<HotelSkeletonHorizontal count={5} />);
    const skeletons = screen.getAllByTestId('hotel-skeleton');
    expect(skeletons).toHaveLength(5);
  });
}); 