import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { SuggestUser } from '@/components/SuggestUser';

describe('SuggestUserComponent', () => {
  it('should render succes cpmponenet', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <SuggestUser />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('suggest-user-comp')));
  });
});
