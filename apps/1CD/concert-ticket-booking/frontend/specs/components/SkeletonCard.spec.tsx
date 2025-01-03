import SkeletonCard from '@/components/SkeletonCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('SkeletonCard', () => {
  it('should render successfully', async () => {
    render(<SkeletonCard />);
  });
});
