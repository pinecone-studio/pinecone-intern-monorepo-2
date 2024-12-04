import AlreadyHaveAnAcc from '@/components/auth/signupCard/AlreadyHaveAnAcc';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AlreadyHaveAnAcc', () => {
  it('should render and navigate to login page on button click', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const { getByTestId } = render(
      <MockedProvider>
        <AlreadyHaveAnAcc />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('card-btn')));
    const modalBtn = getByTestId('push-login-lage-btn');

    fireEvent.click(modalBtn);
  });
});
