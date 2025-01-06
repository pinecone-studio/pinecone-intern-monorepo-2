import SkeletonCarausel from '@/components/SkeletonCarausel';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('SkeletonCarausel', () => {
  it('should render successfully', async () => {
    render(<SkeletonCarausel />);
  });
});
