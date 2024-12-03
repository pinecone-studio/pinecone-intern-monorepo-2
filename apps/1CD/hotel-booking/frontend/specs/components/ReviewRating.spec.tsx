import SelectHotelReviewRating from '@/components/ReviewRating';
import { render, fireEvent } from '@testing-library/react';

it('renders component and handles value change', () => {
  const mockSetFieldValue = jest.fn();

  const { getByTestId, getByText } = render(<SelectHotelReviewRating setFieldValue={mockSetFieldValue} />);

  const selectTrigger = getByTestId('Review-Rating-Stars-Trigger');

  fireEvent.click(selectTrigger);
  const option = getByText('5 ⭐');
  fireEvent.click(option);

  expect(mockSetFieldValue).toHaveBeenCalledWith('rating', 5);
});
