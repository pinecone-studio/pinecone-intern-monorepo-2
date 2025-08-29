/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/TestUtils';
import { useRouter } from 'next/navigation';
import { useHotelsAdminQuery } from '@/generated';
import Tablecontainer from '@/components/admin/Tablecontainer';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the generated GraphQL hook
jest.mock('@/generated', () => ({
  useHotelsAdminQuery: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => <img src={src} alt={alt} width={width} height={height} className={className} data-testid="hotel-image" />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Star: ({ size }: { size: number }) => (
    <div data-testid="star-icon" data-size={size}>
      ⭐
    </div>
  ),
}));

// Mock FilterControls component for integration testing
jest.mock('@/components/admin/FilterControls', () => ({
  FilterControls: ({ searchTerm, setSearchTerm, location, setLocation, rooms, setRooms, starRating, setStarRating, userRating, setUserRating, locationOptions }: any) => (
    <div data-testid="filter-controls-container">
      <div data-testid="search-container">
        <input data-testid="search-input" type="text" placeholder="Search hotels by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div data-testid="filters-container">
        <select data-testid="location-select" value={location} onChange={(e) => setLocation(e.target.value)}>
          {locationOptions.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select data-testid="rooms-select" value={rooms} onChange={(e) => setRooms(e.target.value)}>
          <option value="">All Rooms</option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="deluxe">Deluxe Room</option>
          <option value="suite">Suite</option>
          <option value="family">Family Room</option>
          <option value="presidential">Presidential Suite</option>
        </select>
        <select data-testid="star-rating-select" value={starRating} onChange={(e) => setStarRating(e.target.value)}>
          <option value="">Select Star Rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <select data-testid="user-rating-select" value={userRating} onChange={(e) => setUserRating(e.target.value)}>
          <option value="">Select User Rating</option>
          <option value="9+">9+ / 10</option>
          <option value="8+">8+ / 10</option>
          <option value="7+">7+ / 10</option>
          <option value="6+">6+ / 10</option>
          <option value="5+">5+ / 10</option>
        </select>
      </div>
    </div>
  ),
}));

describe('Tablecontainer', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockHotels = [
    {
      id: '1',
      name: 'Grand Hotel',
      city: 'New York',
      country: 'USA',
      stars: 5,
      rating: 9.2,
      images: ['https://example.com/image1.jpg'],
      amenities: ['AIR_CONDITIONING', 'WIFI', 'POOL', 'GYM', 'SPA', 'ROOM_SERVICE'],
    },
    {
      id: '2',
      name: 'Budget Inn',
      city: 'Los Angeles',
      country: 'USA',
      stars: 3,
      rating: 7.5,
      images: ['https://example.com/image2.jpg'],
      amenities: ['AIR_CONDITIONING', 'WIFI'],
    },
    {
      id: '3',
      name: 'Luxury Resort',
      city: 'Miami',
      country: 'USA',
      stars: 4,
      rating: 8.8,
      images: ['https://example.com/image3.jpg'],
      amenities: ['AIR_CONDITIONING', 'WIFI', 'POOL', 'ROOM_SERVICE'],
    },
    {
      id: '4',
      name: 'Deluxe Hotel',
      city: 'Chicago',
      country: 'USA',
      stars: 4,
      rating: 8.0,
      images: ['https://example.com/image4.jpg'],
      amenities: ['AIR_CONDITIONING', 'WIFI', 'POOL', 'ROOM_SERVICE', 'SPA'],
    },
    {
      id: '5',
      name: 'Family Resort',
      city: 'Orlando',
      country: 'USA',
      stars: 3,
      rating: 7.8,
      images: ['https://example.com/image5.jpg'],
      amenities: ['AIR_CONDITIONING', 'WIFI', 'POOL', 'ROOM_SERVICE'],
    },
  ];

  const mockHotelsWithMissingFields = [
    {
      id: '6',
      name: null,
      city: null,
      country: null,
      stars: null,
      rating: null,
      images: null,
      amenities: null,
    },
    {
      id: '7',
      name: 'Partial Hotel',
      city: 'Chicago',
      country: null,
      stars: 2,
      rating: 6.0,
      images: [],
      amenities: ['AIR_CONDITIONING', 'WIFI'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Loading State', () => {
    it('should display loading message when data is loading', () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      render(<Tablecontainer />);

      expect(screen.getByText('Loading hotels...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when query fails', () => {
      const errorMessage = 'Failed to fetch hotels';
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: { message: errorMessage },
      });

      render(<Tablecontainer />);

      expect(screen.getByText(`Error loading hotels: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Empty Data State', () => {
    it('should handle empty hotels array', () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: [] },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      expect(screen.getByText('No hotels found matching your criteria.')).toBeInTheDocument();
    });

    it('should handle null hotels data', () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: null },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      expect(screen.getByText('No hotels found matching your criteria.')).toBeInTheDocument();
    });
  });

  describe('Successful Data Rendering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should render hotels table with correct data', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
      expect(screen.getByText('Budget Inn')).toBeInTheDocument();
      expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
      expect(screen.getByText('New York, USA')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles, USA')).toBeInTheDocument();
      expect(screen.getByText('Miami, USA')).toBeInTheDocument();
    });

    it('should render table headers correctly', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Stars Rating')).toBeInTheDocument();
      expect(screen.getByText('User Rating')).toBeInTheDocument();
    });

    it('should render hotel images correctly', () => {
      render(<Tablecontainer />);

      const images = screen.getAllByTestId('hotel-image');
      expect(images).toHaveLength(5);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('should render star ratings correctly', () => {
      render(<Tablecontainer />);

      const starIcons = screen.getAllByTestId('star-icon');
      expect(starIcons).toHaveLength(5);
    });
  });

  describe('Hotel Row Click Navigation', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should navigate to hotel detail page when hotel row is clicked', () => {
      render(<Tablecontainer />);

      const firstHotelRow = screen.getByText('Grand Hotel').closest('tr');
      fireEvent.click(firstHotelRow!);

      expect(mockRouter.push).toHaveBeenCalledWith('/admin/hotel/1');
    });

    it('should navigate to correct hotel when different row is clicked', () => {
      render(<Tablecontainer />);

      const secondHotelRow = screen.getByText('Budget Inn').closest('tr');
      fireEvent.click(secondHotelRow!);

      expect(mockRouter.push).toHaveBeenCalledWith('/admin/hotel/2');
    });
  });

  describe('FilterControls Integration', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should render FilterControls component with correct props', () => {
      render(<Tablecontainer />);

      expect(screen.getByTestId('filter-controls-container')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('location-select')).toBeInTheDocument();
      expect(screen.getByTestId('rooms-select')).toBeInTheDocument();
      expect(screen.getByTestId('star-rating-select')).toBeInTheDocument();
      expect(screen.getByTestId('user-rating-select')).toBeInTheDocument();
    });

    it('should pass location options generated from hotel data', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('All Locations')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
      expect(screen.getByText('Miami')).toBeInTheDocument();
      expect(screen.getByText('Chicago')).toBeInTheDocument();
      expect(screen.getByText('Orlando')).toBeInTheDocument();
    });
  });

  describe('Search Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should filter by exact hotel name match', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Grand Hotel' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Luxury Resort')).not.toBeInTheDocument();
      });
    });

    it('should filter by partial hotel name match', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Hotel' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Luxury Resort')).not.toBeInTheDocument();
      });
    });

    it('should filter by case insensitive search', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'grand' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });

    it('should show all hotels when search term is empty', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });

    it('should show no results when search term matches no hotels', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'NonExistentHotel' } });

      await waitFor(() => {
        expect(screen.getByText('No hotels found matching your criteria.')).toBeInTheDocument();
      });
    });
  });

  describe('Location Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should filter by exact city match', async () => {
      render(<Tablecontainer />);

      const locationSelect = screen.getByTestId('location-select');
      fireEvent.change(locationSelect, { target: { value: 'new york' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Luxury Resort')).not.toBeInTheDocument();
      });
    });

    it('should show all hotels when no location is selected', async () => {
      render(<Tablecontainer />);

      const locationSelect = screen.getByTestId('location-select');
      fireEvent.change(locationSelect, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });
  });

  describe('Star Rating Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should filter hotels by minimum star rating', async () => {
      render(<Tablecontainer />);

      const starRatingSelect = screen.getByTestId('star-rating-select');
      fireEvent.change(starRatingSelect, { target: { value: '4' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Family Resort')).not.toBeInTheDocument();
      });
    });

    it('should show all hotels when no star rating is selected', async () => {
      render(<Tablecontainer />);

      const starRatingSelect = screen.getByTestId('star-rating-select');
      fireEvent.change(starRatingSelect, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });
  });

  describe('User Rating Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should filter hotels by minimum user rating', async () => {
      render(<Tablecontainer />);

      const userRatingSelect = screen.getByTestId('user-rating-select');
      fireEvent.change(userRatingSelect, { target: { value: '8+' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Family Resort')).not.toBeInTheDocument();
      });
    });

    it('should show all hotels when no user rating is selected', async () => {
      render(<Tablecontainer />);

      const userRatingSelect = screen.getByTestId('user-rating-select');
      fireEvent.change(userRatingSelect, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });
  });

  describe('Room Type Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should filter hotels by deluxe room amenities', async () => {
      render(<Tablecontainer />);

      const roomsSelect = screen.getByTestId('rooms-select');
      fireEvent.change(roomsSelect, { target: { value: 'deluxe' } });

      await waitFor(() => {
        // Deluxe room requires AIR_CONDITIONING, WIFI, ROOM_SERVICE
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });

    it('should filter hotels by suite amenities', async () => {
      render(<Tablecontainer />);

      const roomsSelect = screen.getByTestId('rooms-select');
      fireEvent.change(roomsSelect, { target: { value: 'suite' } });

      await waitFor(() => {
        // Suite requires AIR_CONDITIONING, WIFI, ROOM_SERVICE, SPA
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Luxury Resort')).not.toBeInTheDocument();
        expect(screen.queryByText('Family Resort')).not.toBeInTheDocument();
      });
    });

    it('should filter hotels by presidential suite amenities', async () => {
      render(<Tablecontainer />);

      const roomsSelect = screen.getByTestId('rooms-select');
      fireEvent.change(roomsSelect, { target: { value: 'presidential' } });

      await waitFor(() => {
        // Presidential suite requires AIR_CONDITIONING, WIFI, ROOM_SERVICE, SPA, POOL, GYM
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Luxury Resort')).not.toBeInTheDocument();
        expect(screen.queryByText('Deluxe Hotel')).not.toBeInTheDocument();
        expect(screen.queryByText('Family Resort')).not.toBeInTheDocument();
      });
    });

    it('should show all hotels when no room type is selected', async () => {
      render(<Tablecontainer />);

      const roomsSelect = screen.getByTestId('rooms-select');
      fireEvent.change(roomsSelect, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });
  });

  describe('Combined Filtering', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should apply search term and location filter together', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const locationSelect = screen.getByTestId('location-select');

      fireEvent.change(searchInput, { target: { value: 'Hotel' } });
      fireEvent.change(locationSelect, { target: { value: 'new york' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Deluxe Hotel')).not.toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });

    it('should apply search term and star rating filter together', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const starRatingSelect = screen.getByTestId('star-rating-select');

      fireEvent.change(searchInput, { target: { value: 'Hotel' } });
      fireEvent.change(starRatingSelect, { target: { value: '4' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });

    it('should apply all filters together', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const locationSelect = screen.getByTestId('location-select');
      const roomsSelect = screen.getByTestId('rooms-select');
      const starRatingSelect = screen.getByTestId('star-rating-select');
      const userRatingSelect = screen.getByTestId('user-rating-select');

      fireEvent.change(searchInput, { target: { value: 'Hotel' } });
      fireEvent.change(locationSelect, { target: { value: 'new york' } });
      fireEvent.change(roomsSelect, { target: { value: 'suite' } });
      fireEvent.change(starRatingSelect, { target: { value: '5' } });
      fireEvent.change(userRatingSelect, { target: { value: '9+' } });

      await waitFor(() => {
        // Grand Hotel should match: name contains "Hotel", location is "new york",
        // has suite amenities (AIR_CONDITIONING, WIFI, ROOM_SERVICE, SPA),
        // 5 stars, and 9.2 rating >= 9+
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Deluxe Hotel')).not.toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });

    it('should show no results when all filters exclude all hotels', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const locationSelect = screen.getByTestId('location-select');

      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
      fireEvent.change(locationSelect, { target: { value: 'new york' } });

      await waitFor(() => {
        expect(screen.getByText('No hotels found matching your criteria.')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Reset Behavior', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should reset search filter when cleared', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');

      // Apply filter
      fireEvent.change(searchInput, { target: { value: 'Grand' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });

      // Clear filter
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Family Resort')).toBeInTheDocument();
      });
    });

    it('should maintain other filters when one filter is reset', async () => {
      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const starRatingSelect = screen.getByTestId('star-rating-select');

      // Apply two filters
      fireEvent.change(searchInput, { target: { value: 'Hotel' } });
      fireEvent.change(starRatingSelect, { target: { value: '4' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });

      // Reset only search filter
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Deluxe Hotel')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
        expect(screen.queryByText('Family Resort')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases - Missing Fields', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotelsWithMissingFields },
        loading: false,
        error: null,
      });
    });

    it('should handle hotels with missing name', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('Unnamed Hotel')).toBeInTheDocument();
    });

    it('should handle hotels with missing location', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('Unknown City, Unknown Country')).toBeInTheDocument();
    });

    it('should handle hotels with missing stars', () => {
      render(<Tablecontainer />);

      const starIcons = screen.getAllByTestId('star-icon');
      expect(starIcons).toHaveLength(2);
    });

    it('should handle hotels with missing rating', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('0/10')).toBeInTheDocument();
    });

    it('should handle hotels with missing images', () => {
      render(<Tablecontainer />);

      const images = screen.getAllByTestId('hotel-image');
      expect(images[0]).toHaveAttribute('src', 'https://via.placeholder.com/50');
    });

    it('should handle hotels with partial data', () => {
      render(<Tablecontainer />);

      expect(screen.getByText('Partial Hotel')).toBeInTheDocument();
      expect(screen.getByText('Chicago, Unknown Country')).toBeInTheDocument();
    });
  });

  describe('Memoized Calculations', () => {
    it('should generate location options from hotel data', () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      // Check that location options are generated from hotel data
      expect(screen.getByText('All Locations')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
      expect(screen.getByText('Miami')).toBeInTheDocument();
      expect(screen.getByText('Chicago')).toBeInTheDocument();
      expect(screen.getByText('Orlando')).toBeInTheDocument();
    });

    it('should recalculate filtered hotels when filters change', async () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Grand' } });

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Budget Inn')).not.toBeInTheDocument();
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid filter changes without errors', async () => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      const locationSelect = screen.getByTestId('location-select');

      // Rapidly change filters
      fireEvent.change(searchInput, { target: { value: 'Grand' } });
      fireEvent.change(locationSelect, { target: { value: 'new york' } });
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.change(locationSelect, { target: { value: '' } });

      await waitFor(() => {
        // Should not crash and should show all hotels
        expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
        expect(screen.getByText('Budget Inn')).toBeInTheDocument();
        expect(screen.getByText('Luxury Resort')).toBeInTheDocument();
      });
    });

    it('should handle large datasets efficiently', async () => {
      const largeHotelDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Hotel ${i + 1}`,
        city: `City ${i % 10}`,
        country: 'USA',
        stars: (i % 5) + 1,
        rating: (i % 10) + 1,
        images: [`https://example.com/image${i + 1}.jpg`],
        amenities: ['AIR_CONDITIONING', 'WIFI'],
      }));

      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: largeHotelDataset },
        loading: false,
        error: null,
      });

      render(<Tablecontainer />);

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Hotel 1' } });

      await waitFor(() => {
        expect(screen.getByText('Hotel 1')).toBeInTheDocument();
        expect(screen.queryByText('Hotel 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (useHotelsAdminQuery as jest.Mock).mockReturnValue({
        data: { hotels: mockHotels },
        loading: false,
        error: null,
      });
    });

    it('should have proper table structure', () => {
      render(<Tablecontainer />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(5);
    });

    it('should have clickable hotel rows', () => {
      render(<Tablecontainer />);

      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        expect(row).toHaveClass('cursor-pointer');
      });
    });
  });
});
