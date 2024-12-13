import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MenuBar } from '@/components/header/MenuBar';

describe('MenuBar', () => {
  it('should render', async () => {
    const { getByTestId, getAllByText, getAllByTestId } = render(
      <MockedProvider>
        <MenuBar setHide={jest.fn()} hide={false} />
      </MockedProvider>
    );
    // jest.mock('next/link');

    jest.mock('next/link', () => ({
      Link: jest.fn(),
    }));

    await waitFor(() => expect(getByTestId('MenuBar')));
    const btn = getAllByTestId('hideIconBtn')[0];
    fireEvent.click(btn);
    const btnn = getAllByTestId('hideIconBtn')[1];
    fireEvent.click(btnn);
    const bb = getAllByText('Notifications');
    fireEvent.click(bb[0]);
  });
  it('should render', async () => {
    const { getByTestId, getAllByText, getAllByTestId } = render(
      <MockedProvider>
        <MenuBar setHide={jest.fn()} hide={true} />
      </MockedProvider>
    );
    // jest.mock('next/link');

    jest.mock('next/link', () => ({
      Link: jest.fn(),
    }));

    await waitFor(() => expect(getByTestId('MenuBar')));
    const btn = getAllByTestId('hideIconBtn')[0];
    fireEvent.click(btn);
    const btnn = getAllByTestId('hideIconBtn')[1];
    fireEvent.click(btnn);
    const bb = getAllByText('Notifications');
    fireEvent.click(bb[0]);
  });
});
