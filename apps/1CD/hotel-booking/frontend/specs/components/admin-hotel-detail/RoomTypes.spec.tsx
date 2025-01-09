import RoomTypes from '@/components/admin-hotel-detail/RoomTypes';
import { RoomType } from '@/generated';
import { fireEvent, render } from '@testing-library/react';

describe('admin hotel detail room type  test', () => {
  it('1. it should render', () => {
    const rooms: RoomType[] = [
      {
        _id: '2',
        hotelId: '1',
        roomName: 'badral',
        roomType: '1bed',
        images: ['/'],
        price: 5000,
      },
    ];
    const { getByTestId } = render(<RoomTypes rooms={rooms} setRoomOpen={jest.fn()} />);
    fireEvent.click(getByTestId('Add-Room-General-Info-Dialog'));
  });
});
