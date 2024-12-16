import StarRatingCheckbox from '@/components/search-hotel/StarRating';
import { fireEvent, render } from '@testing-library/react';

describe('Stars rating component', () => {
  const setMock = jest.fn();
  it('it should be visible and click first checkbox', async () => {
    const { getByTestId } = render(<StarRatingCheckbox setStarRating={setMock} index={0} starRating={0} stars={5} />);
    const button = getByTestId('Stars-Checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith(5);
  });
  it('it should be visible and click to clicked checkbox', async () => {
    const { getByTestId } = render(<StarRatingCheckbox setStarRating={setMock} index={0} starRating={5} stars={5} />);
    const button = getByTestId('Stars-Checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith(0);
  });
});
