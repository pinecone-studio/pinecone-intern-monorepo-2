/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { MostBookedHotelsPage } from '@/components/landing-page/MostBookedHotelPage';
import { useHotelsByRatingQuery } from '@/generated';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/generated', () => ({
  useHotelsByRatingQuery: jest.fn(),
}));

jest.mock('@/components/landing-page/HotelSkeleton', () => ({
  HotelSkeletonGrid: ({ count }: { count: number }) => <div data-testid="skeleton">{count}</div>,
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockQuery = useHotelsByRatingQuery as jest.MockedFunction<typeof useHotelsByRatingQuery>;

beforeEach(() => {
  mockUseRouter.mockReturnValue({ push: mockPush } as any);
  mockPush.mockClear();
});

const sampleHotels = [
  {
    id: '1',
    name: 'Hotel A',
    country: 'Mongolia',
    city: 'Ulaanbaatar',
    rating: 9.0,
    stars: 5,
    images: ['img1.jpg'],
    amenities: ['WiFi', 'Spa', 'Parking'],
  },
  {
    id: '2',
    name: 'Hotel B',
    country: 'China',
    city: 'Beijing',
    rating: 8.0,
    stars: 4,
    images: [],
    amenities: null,
  },
  {
    id: '3',
    name: 'Hotel C',
    country: 'Mongolia',
    city: null,
    rating: null,
    stars: 0,
    images: null,
    amenities: [],
  },
];

describe('MostBookedHotelsPage', () => {
  it('shows loading state', () => {
    mockQuery.mockReturnValue({ data: undefined, loading: true, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('Most Booked Hotels in Mongolia')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockQuery.mockReturnValue({ data: undefined, loading: false, error: { message: 'Error' } });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('Error loading hotels: Error')).toBeInTheDocument();
  });

  it('filters and displays Mongolia hotels only', () => {
    mockQuery.mockReturnValue({ data: { hotelsByRating: sampleHotels }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('Hotel A')).toBeInTheDocument();
    expect(screen.getByText('Hotel C')).toBeInTheDocument();
    expect(screen.queryByText('Hotel B')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 2 hotels in Mongolia')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    mockQuery.mockReturnValue({ data: { hotelsByRating: [] }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('No hotels found in Mongolia.')).toBeInTheDocument();
    expect(screen.getByText('Showing 0 hotels in Mongolia')).toBeInTheDocument();
  });

  it('handles null/undefined data', () => {
    mockQuery.mockReturnValue({ data: null, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('No hotels found in Mongolia.')).toBeInTheDocument();
  });

  it('navigates on hotel click', () => {
    mockQuery.mockReturnValue({ data: { hotelsByRating: sampleHotels }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    fireEvent.click(screen.getByText('Hotel A').closest('div')!);
    expect(mockPush).toHaveBeenCalledWith('/hotel/1');
  });

  it('displays hotel info correctly', () => {
    mockQuery.mockReturnValue({ data: { hotelsByRating: sampleHotels }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('9.0')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('(5 stars)')).toBeInTheDocument();
    expect(screen.getByText('Ulaanbaatar, Mongolia')).toBeInTheDocument();
    expect(screen.getByText('WiFi')).toBeInTheDocument();
  });

  it('handles hotels with null values', () => {
    const nullHotel = [{ id: '1', name: 'Test', country: 'Mongolia', city: null, rating: null, stars: null, images: null, amenities: null }];
    mockQuery.mockReturnValue({ data: { hotelsByRating: nullHotel }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('Poor')).toBeInTheDocument();
    expect(screen.getByText('(0 stars)')).toBeInTheDocument();
    expect(screen.getByText('Mongolia')).toBeInTheDocument();
    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('tests all rating ranges', () => {
    const ratings = [
      { rating: 8.5, text: 'Excellent' },
      { rating: 8.0, text: 'Very Good' },
      { rating: 7.0, text: 'Good' },
      { rating: 6.0, text: 'Fair' },
      { rating: 5.0, text: 'Poor' },
    ];

    ratings.forEach(({ rating, text }) => {
      const hotel = [{ id: '1', name: 'Test', country: 'Mongolia', rating, stars: 3, images: [], amenities: [] }];
      mockQuery.mockReturnValue({ data: { hotelsByRating: hotel }, loading: false, error: undefined });

      const { unmount } = render(<MostBookedHotelsPage />);
      expect(screen.getByText(text)).toBeInTheDocument();
      unmount();
    });
  });

  it('tests amenity icons', () => {
    const amenities = ['wifi', 'spa', 'parking', 'restaurant'];
    amenities.forEach((amenity) => {
      const hotel = [{ id: '1', name: 'Test', country: 'Mongolia', rating: 8, stars: 3, images: [], amenities: [amenity] }];
      mockQuery.mockReturnValue({ data: { hotelsByRating: hotel }, loading: false, error: undefined });

      const { unmount } = render(<MostBookedHotelsPage />);
      expect(screen.getByText(amenity)).toBeInTheDocument();
      unmount();
    });
  });

  it('limits amenities to 3', () => {
    const hotel = [{ id: '1', name: 'Test', country: 'Mongolia', rating: 8, stars: 3, images: [], amenities: ['a', 'b', 'c', 'd', 'e'] }];
    mockQuery.mockReturnValue({ data: { hotelsByRating: hotel }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.queryByText('d')).not.toBeInTheDocument();
  });

  it('sorts hotels by rating', () => {
    const hotels = [
      { id: '1', name: 'Low', country: 'Mongolia', rating: 7.0, stars: 3, images: [], amenities: [] },
      { id: '2', name: 'High', country: 'Mongolia', rating: 9.0, stars: 5, images: [], amenities: [] },
    ];
    mockQuery.mockReturnValue({ data: { hotelsByRating: hotels }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    const hotelNames = screen.getAllByText(/Low|High/);
    expect(hotelNames[0]).toHaveTextContent('High');
    expect(hotelNames[1]).toHaveTextContent('Low');
  });

  it('handles hotels with undefined ratings in sorting', () => {
    const hotels = [
      { id: '1', name: 'No Rating', country: 'Mongolia', rating: undefined, stars: 3, images: [], amenities: [] },
      { id: '2', name: 'High Rating', country: 'Mongolia', rating: 9.0, stars: 5, images: [], amenities: [] },
      { id: '3', name: 'Low Rating', country: 'Mongolia', rating: 7.0, stars: 3, images: [], amenities: [] },
    ];
    mockQuery.mockReturnValue({ data: { hotelsByRating: hotels }, loading: false, error: undefined });
    render(<MostBookedHotelsPage />);

    const hotelNames = screen.getAllByText(/No Rating|High Rating|Low Rating/);
    expect(hotelNames[0]).toHaveTextContent('High Rating');
    expect(hotelNames[1]).toHaveTextContent('Low Rating');
    expect(hotelNames[2]).toHaveTextContent('No Rating');
  });
});
