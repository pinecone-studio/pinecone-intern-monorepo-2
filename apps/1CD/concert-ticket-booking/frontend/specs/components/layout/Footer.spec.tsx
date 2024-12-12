import { Footer } from '@/components/footer/Footer';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<Footer />);
  });
});
