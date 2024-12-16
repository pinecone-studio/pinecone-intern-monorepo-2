import AmenitiesCheckbox from '@/components/search-hotel/AmenitiesCheckbox';
import { fireEvent, render } from '@testing-library/react';

describe('Amenities checkbox component', () => {
  const setMock = jest.fn();

  it('1. it should be visible and click first checkbox', async () => {
    const { getByTestId } = render(<AmenitiesCheckbox setHotelAmenities={setMock} hotelAmenities={[]} index={0} amenities={'Pet Friendly'} />);
    const button = getByTestId('Hotel-Amenity-Checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith(['Pet Friendly']);
  });
  it('2. it should be visible and click before clicked checkbox', async () => {
    const { getByTestId } = render(<AmenitiesCheckbox setHotelAmenities={setMock} hotelAmenities={['Pet Friendly']} index={0} amenities={'Pet Friendly'} />);
    const button = getByTestId('Hotel-Amenity-Checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith([]);
  });
});
