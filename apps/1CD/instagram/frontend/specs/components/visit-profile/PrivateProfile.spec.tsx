import PrivateProfile from '@/components/visit-profile/PrivateProfile';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

describe('PrivateProfile', () => {
  it('should render successfully', async () => {
    render(
      <MockedProvider>
        <PrivateProfile />
      </MockedProvider>
    );
  });
});
