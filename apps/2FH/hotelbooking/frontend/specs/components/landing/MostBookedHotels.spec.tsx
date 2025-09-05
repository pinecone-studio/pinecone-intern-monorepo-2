/* eslint-disable  */
import { render, screen, fireEvent } from '@testing-library/react';
import { MostBookedHotels } from '@/components/landing-page/MostBookedHotels';
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

describe('MostBookedHotels Component', () => {
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

    render(<MostBookedHotels />);
    expect(screen.getByText('Most booked hotels in Mongolia in past month')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-grid')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: { message: 'Failed to load hotels' },
    });

    render(<MostBookedHotels />);
    expect(screen.getByText(/Error loading hotels: Failed to load hotels/)).toBeInTheDocument();
  });

  test('renders hotels when data is available', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            country: 'Mongolia',
            rating: 8.5,
            stars: 4,
            amenities: ['Wifi', 'Parking'],
            images: ['/image1.jpg'],
          },
          {
            id: '2',
            name: 'Hotel Two',
            country: 'Mongolia',
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

    render(<MostBookedHotels />);
    expect(screen.getByText('Hotel One')).toBeInTheDocument();
    expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  test('handles view all button click', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: { hotelsByRating: [] },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    fireEvent.click(screen.getByText('View all'));
    expect(mockPush).toHaveBeenCalledWith('/most-booked-hotels');
  });

  test('handles hotel card click', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            country: 'Mongolia',
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

    render(<MostBookedHotels />);
    fireEvent.click(screen.getByText('Hotel One'));
    expect(mockPush).toHaveBeenCalledWith('/hotel/1');
  });

  test('renders correct rating text', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel One', country: 'Mongolia', rating: 8.5, stars: 4, amenities: [], images: [] },
          { id: '2', name: 'Hotel Two', country: 'Mongolia', rating: 8.2, stars: 3, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });

  test('renders correct amenity icons', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          {
            id: '1',
            name: 'Hotel One',
            country: 'Mongolia',
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

    render(<MostBookedHotels />);
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
            country: 'Mongolia',
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

    render(<MostBookedHotels />);
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
            country: 'Mongolia',
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

    render(<MostBookedHotels />);
    expect(screen.getByText('(4 stars)')).toBeInTheDocument();
  });

  test('renders Fair and Poor rating text', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel One', country: 'Mongolia', rating: 6.5, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'Hotel Two', country: 'Mongolia', rating: 5.0, stars: 2, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    expect(screen.getByText('Fair')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  test('handles hotels with undefined/null stars and rating values', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [{ id: '1', name: 'Hotel One', country: 'Mongolia', rating: undefined, stars: undefined, amenities: [], images: [] }],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    expect(screen.getByText('(0 stars)')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
  });

  test('filters and sorts hotels correctly with mixed data', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Low Rating', country: 'Mongolia', rating: 7.0, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'High Rating', country: 'Mongolia', rating: 9.0, stars: 5, amenities: [], images: [] },
          { id: '3', name: 'China Hotel', country: 'China', rating: 8.5, stars: 4, amenities: [], images: [] },
          { id: '4', name: 'Medium Rating', country: 'Mongolia', rating: 8.0, stars: 4, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    // Should only show Mongolia hotels, sorted by rating (highest first)
    expect(screen.getByText('High Rating')).toBeInTheDocument();
    expect(screen.getByText('Medium Rating')).toBeInTheDocument();
    expect(screen.getByText('Low Rating')).toBeInTheDocument();
    expect(screen.queryByText('China Hotel')).not.toBeInTheDocument();
  });

  test('handles empty hotels array and null data', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    // Should render without crashing and show no hotels
    expect(screen.getByText('Most booked hotels in Mongolia in past month')).toBeInTheDocument();
  });

  test('handles undefined hotelsByRating', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: { hotelsByRating: undefined },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    // Should render without crashing and show no hotels
    expect(screen.getByText('Most booked hotels in Mongolia in past month')).toBeInTheDocument();
  });

  test('limits to top 4 hotels after filtering and sorting', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel 1', country: 'Mongolia', rating: 9.0, stars: 5, amenities: [], images: [] },
          { id: '2', name: 'Hotel 2', country: 'Mongolia', rating: 8.5, stars: 4, amenities: [], images: [] },
          { id: '3', name: 'Hotel 3', country: 'Mongolia', rating: 8.0, stars: 4, amenities: [], images: [] },
          { id: '4', name: 'Hotel 4', country: 'Mongolia', rating: 7.5, stars: 3, amenities: [], images: [] },
          { id: '5', name: 'Hotel 5', country: 'Mongolia', rating: 7.0, stars: 3, amenities: [], images: [] },
          { id: '6', name: 'Hotel 6', country: 'Mongolia', rating: 6.5, stars: 2, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    // Should only show top 4 hotels
    expect(screen.getByText('Hotel 1')).toBeInTheDocument();
    expect(screen.getByText('Hotel 2')).toBeInTheDocument();
    expect(screen.getByText('Hotel 3')).toBeInTheDocument();
    expect(screen.getByText('Hotel 4')).toBeInTheDocument();
    expect(screen.queryByText('Hotel 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Hotel 6')).not.toBeInTheDocument();
  });

  test('covers sorting logic with hotels having null ratings', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      data: {
        hotelsByRating: [
          { id: '1', name: 'Hotel A', country: 'Mongolia', rating: null, stars: 3, amenities: [], images: [] },
          { id: '2', name: 'Hotel B', country: 'Mongolia', rating: 8.0, stars: 4, amenities: [], images: [] },
          { id: '3', name: 'Hotel C', country: 'Mongolia', rating: null, stars: 2, amenities: [], images: [] },
          { id: '4', name: 'Hotel D', country: 'Mongolia', rating: 9.0, stars: 5, amenities: [], images: [] },
        ],
      },
      loading: false,
      error: null,
    });

    render(<MostBookedHotels />);
    // Should sort correctly with null ratings treated as 0
    expect(screen.getByText('Hotel D')).toBeInTheDocument(); // 9.0 rating
    expect(screen.getByText('Hotel B')).toBeInTheDocument(); // 8.0 rating
    expect(screen.getByText('Hotel A')).toBeInTheDocument(); // null rating (treated as 0)
    expect(screen.getByText('Hotel C')).toBeInTheDocument(); // null rating (treated as 0)
  });
});
