import { NoPost } from '@/components/user-profile/NoPost';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

describe('NoPostComponent', () => {
  it('should render successfully', async () => {
    render(
      <MockedProvider>
        <NoPost />
      </MockedProvider>
    );
  });
});
