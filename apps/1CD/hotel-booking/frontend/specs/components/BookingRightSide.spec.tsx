import { BookingPageRightSide } from '@/components/BookingPageRightSide';
import { Room } from '@/generated';
import { render } from '@testing-library/react';

jest.mock('nuqs', () => ({
  useQueryState: jest
    .fn()
    .mockReturnValueOnce([new Date('2024-01-01T12:00:00Z')])
    .mockReturnValueOnce([new Date('2024-01-02T12:00:00Z')]),
}));
describe('Booking-Right-Side', () => {
  const room: Room = {
    amenities: ['a'],

    images: ['/https'],
    price: 50000,
    roomInformation: ['badral'],
    roomName: 'room',

    roomType: '1bed',
    id: '1',
    roomService: {
      bathroom: ['a'],
      bedroom: ['a'],
    },
    hotelId: {
      _id: '2',
    },
  };
  it('should be render', () => {
    render(<BookingPageRightSide room={room} />);
  });
});
