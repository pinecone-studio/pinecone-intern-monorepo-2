import { AdminFooter } from '@/app/admin/home/_components/AdminFooter';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render successfully', async () => {
    render(<AdminFooter />);
  });
});
