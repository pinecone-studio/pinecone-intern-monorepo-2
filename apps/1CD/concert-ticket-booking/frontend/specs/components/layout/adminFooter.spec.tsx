import { AdminFooter } from '@/app/admin/home/_components/adminFooter';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<AdminFooter />);
  });
});
