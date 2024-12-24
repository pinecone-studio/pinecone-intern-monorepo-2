import { render } from '@testing-library/react';
import RoomCarousel from '@/app/(public)/hotel-detail/HotelRoomCarousel';

describe('RoomCarousel', () => {
  it('should render images correctly', () => {
    const roomImages = ['https://via.placeholder.com/580x433', 'https://via.placeholder.com/580x433?text=Second+Image'];

    render(<RoomCarousel roomImages={roomImages} />);
  });

  it('should render with no images', () => {
    render(<RoomCarousel roomImages={[]} />);
  });
});
