/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import { PopularHotelsPage } from '@/components/landing-page/PopularHotelsPage';
import { useRouter } from 'next/navigation';
import { useHotelsByRatingQuery } from '@/generated';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/generated', () => ({
  useHotelsByRatingQuery: jest.fn(),
}));
jest.mock('@/components/landing-page/HotelSkeleton', () => ({
  HotelSkeletonGrid: () => <div data-testid="skeleton-grid">Loading...</div>,
}));

describe('PopularHotelsPage Component', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders loading state', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('All Popular Hotels')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: { message: 'Failed to load hotels' },
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText(/Error loading hotels: Failed to load hotels/)).toBeInTheDocument();
  });

  test('renders hotels when data is available', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: 8.5,
            stars: 4,
            amenities: ['Wifi', 'Parking'],
            images: ['/image1.jpg'],
          },
          {
            id: '2',
            name: 'Hotel Two',
            rating: 7.5,
            stars: 3,
            amenities: ['Spa'],
            images: [],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('Hotel One')).toBeInTheDocument();
    expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 hotels')).toBeInTheDocument();
  });

  test('handles hotel card click', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: 8.5,
            stars: 4,
            amenities: ['Wifi'],
            images: ['/image1.jpg'],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    fireEvent.click(screen.getByText('Hotel One'));
    expect(mockPush).toHaveBeenCalledWith('/hotel/1');
  });

  test('renders correct rating text', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel One', rating: 8.5, stars: 4, amenities: [], images: [] },
          { id: '2', name: 'Hotel Two', rating: 6.5, stars: 3, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  test('renders correct amenity icons', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: 8.5,
            stars: 4,
            amenities: ['Wifi', 'Parking', 'Spa'],
            images: [],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Spa')).toBeInTheDocument();
  });

  test('getAmenityIcon returns null for unrecognized amenity', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: 8.5,
            stars: 4,
            amenities: ['Pool'], // Amenity that doesn't match wifi, spa, or parking
            images: [],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('Pool')).toBeInTheDocument(); // Verify the amenity is rendered
    // Since getAmenityIcon returns null, no icon should be rendered for 'Pool'
    expect(screen.getByText('Pool').previousSibling).toBeNull(); // Check that no icon element exists before the amenity text
  });

  test('renders stars correctly', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: 8.5,
            stars: 4,
            amenities: [],
            images: [],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('(4 stars)')).toBeInTheDocument();
  });

  test('handles hotels with undefined stars and rating', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            rating: undefined,
            stars: undefined,
            amenities: [],
            images: [],
          },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('(0 stars)')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  test('renders correct rating text for 7.5 and 7.0 thresholds', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel One', rating: 7.5, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'Hotel Two', rating: 7.0, stars: 3, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('Good')).toBeInTheDocument(); // 7.5 rating
    expect(screen.getByText('Fair')).toBeInTheDocument(); // 7.0 rating
  });

  test('sorts hotels by rating correctly with mixed data', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Low Rating', rating: 7.0, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'High Rating', rating: 9.0, stars: 5, amenities: [], images: [] },
          { id: '3', name: 'Medium Rating', rating: 8.0, stars: 4, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    // Should be sorted by rating (highest first)
    const hotelNames = screen.getAllByText(/Low Rating|High Rating|Medium Rating/);
    expect(hotelNames[0]).toHaveTextContent('High Rating');
    expect(hotelNames[1]).toHaveTextContent('Medium Rating');
    expect(hotelNames[2]).toHaveTextContent('Low Rating');
  });

  test('handles null data and undefined hotelsByRating', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('All Popular Hotels')).toBeInTheDocument();
  });

  test('handles undefined hotelsByRating in data', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: { hotelsByRating: undefined },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('All Popular Hotels')).toBeInTheDocument();
  });

  test('handles empty hotels array', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: { hotelsByRating: [] },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    expect(screen.getByText('All Popular Hotels')).toBeInTheDocument();
    expect(screen.getByText('Showing 0 hotels')).toBeInTheDocument();
  });

  test('covers sorting logic with hotels having null ratings', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel A', rating: null, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'Hotel B', rating: 8.0, stars: 4, amenities: [], images: [] },
          { id: '3', name: 'Hotel C', rating: null, stars: 2, amenities: [], images: [] },
          { id: '4', name: 'Hotel D', rating: 9.0, stars: 5, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<PopularHotelsPage />);
    // Should sort correctly with null ratings treated as 0
    expect(screen.getByText('Hotel D')).toBeInTheDocument(); // 9.0 rating
    expect(screen.getByText('Hotel B')).toBeInTheDocument(); // 8.0 rating
    expect(screen.getByText('Hotel A')).toBeInTheDocument(); // null rating (treated as 0)
    expect(screen.getByText('Hotel C')).toBeInTheDocument(); // null rating (treated as 0)
  });
});
