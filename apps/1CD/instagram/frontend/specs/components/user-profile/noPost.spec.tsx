import { NoPost } from '@/components/user-profile/Nopost';
import { render } from '@testing-library/react';

describe('NoPostComponent', () => {
  it('should render successfully', async () => {
    render(<NoPost />);
  });
});
