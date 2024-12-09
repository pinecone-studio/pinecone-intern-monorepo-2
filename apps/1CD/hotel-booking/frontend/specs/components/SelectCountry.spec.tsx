import SelectCountry from '@/components/SelectCountry';
import { fireEvent, render } from '@testing-library/react';

describe('select payment card country', () => {
  it('should be no problem', () => {
    const mockSetFieldValue = jest.fn();

    const { getByTestId, getByText } = render(<SelectCountry setFieldValue={mockSetFieldValue} />);

    const trigger = getByTestId('Country-Select-Trigger');
    fireEvent.click(trigger);
    const option = getByText('Mongolia 🇲🇳');
    fireEvent.click(option);
    expect(mockSetFieldValue).toHaveBeenCalledWith('country', 'Mongolia');
  });
});
