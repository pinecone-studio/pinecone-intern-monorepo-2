import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { UserBar } from '@/components/header/UserBar';

describe('Userbar', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <UserBar />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('user-bar')));
  });
});
