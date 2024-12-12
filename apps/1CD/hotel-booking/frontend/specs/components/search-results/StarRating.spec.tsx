import StarRatingCheckbox from '@/components/search-hotel/StarRating';
import { render } from '@testing-library/react';

describe('Stars rating component', () => {
  it('it should be visible', async () => {
    render(<StarRatingCheckbox stars={0} />);
  });
});
