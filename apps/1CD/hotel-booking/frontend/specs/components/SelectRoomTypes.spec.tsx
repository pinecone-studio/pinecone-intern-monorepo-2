import SelectRoomTypes from '@/components/SelectRoomTypes';
import { fireEvent, render } from '@testing-library/react';

describe('select room', () => {
  const setMockData = jest.fn();
  it('should render', () => {
    const { getByTestId, getByText } = render(<SelectRoomTypes setFieldValue={setMockData} />);
    const trigger = getByTestId('Select-Room-Type-Trigger');
    fireEvent.click(trigger);
    const toSelectItem = getByText('1bed');
    fireEvent.click(toSelectItem);
    expect(setMockData).toHaveBeenCalledWith('roomType', '1bed');
  });
});
