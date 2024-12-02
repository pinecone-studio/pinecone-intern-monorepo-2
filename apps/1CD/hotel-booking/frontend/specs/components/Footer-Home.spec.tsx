import { FooterHome } from '@/components/providers/FooterHome';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<FooterHome />);
  });
});
