import HomePageCard from '@/components/HomePageCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('HomePageCard', () => {
  const hotel = {
    _id: '1',
    hotelName: 'test',
    images: ['/https'],
  };
  it('should render successfully', async () => {
    render(<HomePageCard hotel={hotel} />);
  });
  it('should render successfully', async () => {
    render(
      <HomePageCard
        hotel={{
          _id: '2',
          hotelName: 'test',
        }}
      />
    );
  });
});
