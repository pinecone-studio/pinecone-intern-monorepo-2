
import HotelRoomDetail from '@/components/HotelRoomDetail';
import { RoomType } from '@/generated';

import { render } from '@testing-library/react';

describe('hotel room detail test', () => {
    const room: RoomType = {
        hotelId: '1',
        images: ['/s'],
        amenities:["a","b"],
        roomService:{
            bathroom:["a"],
            bedroom:["b"],
            accessability:['a'],
            foodDrink:["a"],
            entertaiment:["a"],
            other:["asd"]
        }
      };
  it('it should render', () => {
    render(<HotelRoomDetail isOpen={true} handleOpen={jest.fn()} handleState={jest.fn()} room={room}/>);
  });
});
