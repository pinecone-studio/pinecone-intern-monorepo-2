import { render } from '@testing-library/react';
import { SearchedHotelCards } from '@/components/search-hotel/SearchedHotelCards';

describe('Searched hotel room cards', () => {
  it('should render', async () => {
    render(
      <SearchedHotelCards
        hotelData={{
          __typename: undefined,
          _id: '',
          createdAt: undefined,
          description: undefined,
          hotelName: undefined,
          phoneNumber: undefined,
          starRating: undefined,
          userRating: undefined,
        }}
      />
    );
  });
});
