import { SearchDash } from '@/components/search/SearchDash';
import { fireEvent, render, screen } from '@testing-library/react';

const mockSetSearch = jest.fn();
const mockSetSelectedStars = jest.fn();
const mockSetSelectedRating = jest.fn();
const mockSetAmenities = jest.fn();
const mockSearch = 'test';
const mockSelectedStars = '5';
const mockSelectedRating = '9';
const mockAmenities = 'pool';

describe('SearchDash', () => {
  it('should render', () => {
    render(
      <SearchDash
        search={mockSearch}
        setSearch={mockSetSearch}
        selectedStars={mockSelectedStars}
        setSelectedStars={mockSetSelectedStars}
        selectedRating={mockSelectedRating}
        setSelectedRating={mockSetSelectedRating}
        amenities={mockAmenities}
        setAmenities={mockSetAmenities}
      />
    );
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'hotel' } });
    expect(mockSetSearch).toHaveBeenCalledWith('hotel');
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
  });
});
