import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Header } from '@/components/header/Header';

describe('Header', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Header />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('header')));
  });
  it('should render', async () => {
    const { getByTestId, getAllByTestId } = render(
      <MockedProvider>
        <Header />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('header')));
    const btn = getAllByTestId('hideIconBtn')[0];
    fireEvent.click(btn);
  });
});
