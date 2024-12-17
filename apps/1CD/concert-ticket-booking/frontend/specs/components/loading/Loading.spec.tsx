import LoadingSpinner from '@/components/loading/Loading';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<LoadingSpinner />);
  });
});
