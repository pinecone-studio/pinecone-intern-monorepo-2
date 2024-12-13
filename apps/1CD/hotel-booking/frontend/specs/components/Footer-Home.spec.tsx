import FooterHome from '@/components/FooterHome';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Footer Home', () => {
  it('should render successfully', async () => {
    render(<FooterHome />);
  });
});
