import PriceDetail from '@/components/PriceDetail';
import { RoomType } from '@/generated';
import { render } from '@testing-library/react';

describe('price detail', () => {
  const room: RoomType = {
    hotelId: '1',
    images: ['s'],
  };
  it('it should render', () => {
    render(<PriceDetail room={room} handleOpen={jest.fn()} isOn={true} />);
  });
});
