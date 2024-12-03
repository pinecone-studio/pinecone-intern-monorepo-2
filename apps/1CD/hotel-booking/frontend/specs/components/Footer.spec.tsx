import Footer from '@/components/Footer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<Footer />);
  });
});
