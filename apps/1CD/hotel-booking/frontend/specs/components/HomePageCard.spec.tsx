import HomePageCard from '@/components/HomePageCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('HomePageCard', () => {
  const hotel = {
    _id: '1',
    hotelName: 'test',
  };
  it('should render successfully', async () => {
    render(<HomePageCard hotel={hotel} />);
  });
});
