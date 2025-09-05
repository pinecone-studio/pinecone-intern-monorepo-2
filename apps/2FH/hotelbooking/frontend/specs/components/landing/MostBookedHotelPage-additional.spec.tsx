import React from 'react';
import { render, screen } from '@testing-library/react';
import { MostBookedHotelsPage } from '@/components/landing-page/MostBookedHotelPage';
import { useHotelsByRatingQuery } from '@/generated';
import { useRouter } from 'next/navigation';

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock GraphQL hook
jest.mock('@/generated', () => ({
  useHotelsByRatingQuery: jest.fn(),
}));

// Mock skeleton
jest.mock('@/components/landing-page/HotelSkeleton', () => ({
  HotelSkeletonGrid: ({ count }: { count: number }) => <div data-testid="skeleton">Loading {count}</div>,
}));

describe('MostBookedHotelsPage - Additional Coverage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders "Good" rating for hotels with rating exactly 7.5', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        hotelsByRating: [
          {
            id: '7',
            name: 'Exact Good Hotel',
            stars: 3,
            rating: 7.5,
            country: 'Mongolia',
            city: 'Darkhan',
            images: ['hotel.jpg'],
            amenities: [],
          },
        ],
      },
    });

    render(<MostBookedHotelsPage />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders spa amenity with exact "spa" text', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        hotelsByRating: [
          {
            id: '8',
            name: 'Spa Hotel',
            stars: 4,
            rating: 8.0,
            country: 'Mongolia',
            city: 'Ulaanbaatar',
            images: ['hotel.jpg'],
            amenities: ['spa'],
          },
        ],
      },
    });

    render(<MostBookedHotelsPage />);
    expect(screen.getByText('spa')).toBeInTheDocument();
  });
});

  it('renders "Good" rating for hotels with rating between 7.5 and 8.0', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        hotelsByRating: [
          {
            id: '9',
            name: 'Good Hotel Range',
            stars: 3,
            rating: 7.8, // Between 7.5 and 8.0 should trigger "Good" rating
            country: 'Mongolia',
            city: 'Darkhan',
            images: ['hotel.jpg'],
            amenities: [],
          },
        ],
      },
    });

    render(<MostBookedHotelsPage />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders spa amenity with "Spa Services" text', () => {
    (useHotelsByRatingQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        hotelsByRating: [
          {
            id: '10',
            name: 'Spa Services Hotel',
            stars: 4,
            rating: 8.0,
            country: 'Mongolia',
            city: 'Ulaanbaatar',
            images: ['hotel.jpg'],
            amenities: ['Spa Services'], // This should trigger spa icon
          },
        ],
      },
    });

    render(<MostBookedHotelsPage />);
    expect(screen.getByText('Spa Services')).toBeInTheDocument();
  });
