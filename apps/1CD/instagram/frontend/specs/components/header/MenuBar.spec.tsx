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
    const menuBtn1 = getByTestId('menuBtn1');
    fireEvent.click(menuBtn1);

    const menuBtn2 = getByTestId('menuBtn2');
    fireEvent.click(menuBtn2);

    const btn = getAllByTestId('hideIconBtn')[0];
    fireEvent.click(btn);

    const moreCreateBtn = getByTestId('moreCreateBtn');
    fireEvent.keyDown(moreCreateBtn, { key: 'Enter' });

    const CreatePostBtn = getByTestId('CreatePostBtn');
    fireEvent.click(CreatePostBtn);

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

    const menuBtn1 = getByTestId('menuBtn1');
    fireEvent.click(menuBtn1);

    const menuBtn2 = getByTestId('menuBtn2');
    fireEvent.click(menuBtn2);

    const btn = getAllByTestId('hideIconBtn')[0];
    fireEvent.click(btn);

    const moreCreateBtn = getByTestId('moreCreateBtn');
    fireEvent.keyDown(moreCreateBtn, { key: 'Enter' });

    const CreatePostBtn = getByTestId('CreatePostBtn');
    fireEvent.click(CreatePostBtn);

    const btnn = getAllByTestId('hideIconBtn')[1];
    fireEvent.click(btnn);

    const bb = getAllByText('Notifications');
    fireEvent.click(bb[0]);
  });
});
