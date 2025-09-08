import { render, screen, waitFor } from '@testing-library/react';
import { SearchHotel } from '@/components/search/SearchHotel';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HotelsDocument } from '@/generated';

const mockHotels: MockedResponse[] = [
  {
    request: { query: HotelsDocument },
    result: {
      data: {
        hotels: [
          {
            id: '1',
            name: 'Hotel 1',
            stars: 5,
            rating: 9,
            amenities: ['pool'],
            images: ['https://example.com/hotel1.jpg'],
          },
          {
            id: '2',
            name: 'Hotel 2',
            stars: 4,
            rating: 8,
            amenities: ['airport-shuttle'],
            images: ['https://example.com/hotel2.jpg'],
          },
          {
            id: '3',
            name: 'Pet Paradise',
            stars: 3,
            rating: 7,
            amenities: ['pet-friendly'],
            images: ['https://example.com/hotel3.jpg'],
          },
        ],
      },
    },
  },
];

describe('SearchHotel', () => {
  it('filters hotels correctly by search, stars, rating, and amenities', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="Hotel" selectedStars="5" selectedRating="9" amenities="pool" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel1 = screen.getByText('Hotel 1');
      expect(hotel1).toBeInTheDocument();
    });

    expect(screen.queryByText('Hotel 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Pet Paradise')).not.toBeInTheDocument();
  });

  it('filters hotels with rating 8 correctly', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="" selectedStars="" selectedRating="8" amenities="" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel2 = screen.getByText('Hotel 2');
      expect(hotel2).toBeInTheDocument();
    });

    expect(screen.queryByText('Hotel 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Pet Paradise')).not.toBeInTheDocument();
  });

  it('filters hotels with rating 7 correctly', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="" selectedStars="" selectedRating="7" amenities="" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel3 = screen.getByText('Pet Paradise');
      expect(hotel3).toBeInTheDocument();
    });

    expect(screen.queryByText('Hotel 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Hotel 2')).not.toBeInTheDocument();
  });

  it('filters hotels by amenities correctly', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="" selectedStars="" selectedRating="" amenities="pool" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel1 = screen.getByText('Hotel 1');
      expect(hotel1).toBeInTheDocument();
    });

    expect(screen.queryByText('Hotel 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Pet Paradise')).not.toBeInTheDocument();
  });

  it('filters hotels by search correctly', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="Pet" selectedStars="" selectedRating="" amenities="" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel3 = screen.getByText('Pet Paradise');
      expect(hotel3).toBeInTheDocument();
    });

    expect(screen.queryByText('Hotel 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Hotel 2')).not.toBeInTheDocument();
  });

  it('handles invalid rating values correctly', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="" selectedStars="" selectedRating="6" amenities="" />
      </MockedProvider>
    );

    await waitFor(() => {
      const hotel1 = screen.getByText('Hotel 1');
      const hotel2 = screen.getByText('Hotel 2');
      const hotel3 = screen.getByText('Pet Paradise');
      expect(hotel1).toBeInTheDocument();
      expect(hotel2).toBeInTheDocument();
      expect(hotel3).toBeInTheDocument();
    });
  });
});
