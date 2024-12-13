import RatingCheckbox from '@/components/search-hotel/RatingRadio';
import { fireEvent, render } from '@testing-library/react';

describe('UserRatig checkbox', () => {
  const setMock = jest.fn();

  it('should render and click checkbox', async () => {
    const { getByTestId } = render(<RatingCheckbox index={0} userReviewRating={0} setUserReviewRating={setMock} rating={0} />);
    const button = getByTestId('checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith(0);
  });
  it('should render and onClicked checkbox click', async () => {
    const { getByTestId } = render(<RatingCheckbox index={0} userReviewRating={9} setUserReviewRating={setMock} rating={0} />);
    const button = getByTestId('checkbox0');
    fireEvent.click(button);
    expect(setMock).toHaveBeenCalledWith(0);
  });
});
