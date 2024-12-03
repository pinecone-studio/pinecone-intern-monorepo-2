import SelectHotelStars from '@/components/SelectHotelStars';
import { fireEvent, render } from '@testing-library/react';

describe('SelectHotelStars component test', () => {
  it('component is render and can value change', () => {
    const mockSetFieldValue = jest.fn();
    const { getByTestId, getByText } = render(<SelectHotelStars setFieldValue={mockSetFieldValue} />);
    const trigger = getByTestId('Stars-Rating-Select-Trigger');
    fireEvent.click(trigger);
    const option = getByText('5 ⭐ hotel');
    fireEvent.click(option);
    expect(mockSetFieldValue).toHaveBeenCalledWith('starsRating', 5);
  });
});
