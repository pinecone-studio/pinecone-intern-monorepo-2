import AmenitiesCheckbox from '@/components/search-hotel/AmenitiesCheckbox';
import { render } from '@testing-library/react';

describe('Amenities checkbox component', () => {
  it('it should be visible', async () => {
    render(<AmenitiesCheckbox amenities={''} />);
  });
});
