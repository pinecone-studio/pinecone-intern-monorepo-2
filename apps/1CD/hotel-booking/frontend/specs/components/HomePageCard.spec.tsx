import HomePageCard from '@/components/HomePageCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('HomePageCard', () => {
  it('should render successfully', async () => {
    render(<HomePageCard />);
  });
});
