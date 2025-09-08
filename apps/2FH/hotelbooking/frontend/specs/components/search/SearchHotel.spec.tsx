/* eslint-disable */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchHotel } from '@/components/search/SearchHotel';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HotelsDocument } from '@/generated';
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
const mockHotels: MockedResponse[] = [
  {
    request: { query: HotelsDocument },
    result: {
      data: {
        hotels: [
          {
            id: '1',
            name: 'Hotel 1',
            description: 'A beautiful hotel',
            stars: 5,
            phone: '+1234567890',
            rating: 9,
            city: 'Ulaanbaatar',
            country: 'Mongolia',
            location: 'Downtown',
            amenities: ['pool'],
            images: ['https://example.com/hotel1.jpg'],
            languages: ['English', 'Mongolian'],
            policies: [],
            optionalExtras: [],
            faq: [],
          },
          {
            id: '2',
            name: 'Hotel 2',
            description: 'Another beautiful hotel',
            stars: 4,
            phone: '+1234567891',
            rating: 8,
            city: 'Ulaanbaatar',
            country: 'Mongolia',
            location: 'Airport',
            amenities: ['airport-shuttle'],
            images: ['https://example.com/hotel2.jpg'],
            languages: ['English', 'Mongolian'],
            policies: [],
            optionalExtras: [],
            faq: [],
          },
          {
            id: '3',
            name: 'Pet Paradise',
            description: 'Pet-friendly hotel',
            stars: 3,
            phone: '+1234567892',
            rating: 7,
            city: 'Ulaanbaatar',
            country: 'Mongolia',
            location: 'Suburb',
            amenities: ['pet-friendly'],
            images: ['https://example.com/hotel3.jpg'],
            languages: ['English', 'Mongolian'],
            policies: [],
            optionalExtras: [],
            faq: [],
          },
        ],
      },
    },
  },
];
describe('SearchHotel', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
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
  it('navigates to hotel detail page when hotel card is clicked', async () => {
    render(
      <MockedProvider mocks={mockHotels} addTypename={false}>
        <SearchHotel search="" selectedStars="" selectedRating="" amenities="" />
      </MockedProvider>
    );
    const hotelCards = await waitFor(() => screen.getAllByTestId('hotel-card'));
    const firstHotelCard = hotelCards[0];
    fireEvent.click(firstHotelCard);
    expect(mockPush).toHaveBeenCalledWith('/hotel/1');
  });
});
