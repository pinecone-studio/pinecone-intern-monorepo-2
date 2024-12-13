import Notification from '@/components/notification';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Notification', () => {
  it('should render notification component', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Notification />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('notification-component')));
    const confirmBtn = getByTestId('confirm-btn');
    const deleteBtn = getByTestId('confirm-btn');

    fireEvent.click(confirmBtn);
    fireEvent.click(deleteBtn);
  });
});
