import RatingCheckbox from '@/components/search-hotel/RatingRadio';
import { render } from '@testing-library/react';

describe('UserRatig checkbox', () => {
  it('should render', async () => {
    render(<RatingCheckbox rating={0} />);
  });
});
