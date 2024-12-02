import Login from '@/components/AuthComponents/Login';
import { LoginProvider } from '@/context/LoginContext';
import { CreatesOtpDocument } from '@/generated';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const newDate = new Date();

const createOtpMock: MockedResponse = {
  request: {
    query: CreatesOtpDocument,
    variables: { email: 'test@example.com' },
  },
  result: {
    data: {
      createsOTP: {
        email: 'test@example.com',
        expirationDate: newDate.toISOString(),
        __typename: 'CreatesOTP',
      },
    },
  },
};

describe('Login request, OTP creation, component test', () => {
  it('validates email input and shows errors', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider>
        <LoginProvider>
          <Login />
        </LoginProvider>
      </MockedProvider>
    );

    fireEvent.click(getByTestId('sendOTP-submit-button'));

    await waitFor(() => expect(getByText('И-мэйл хаяг оруулна уу')));
  });

  it('submits OTP request and navigates on success', async () => {
    const router = useRouter();
    const { getByTestId } = render(
      <MockedProvider mocks={[createOtpMock]} addTypename={false}>
        <LoginProvider>
          <Login />
        </LoginProvider>
      </MockedProvider>
    );

    const emailInput = getByTestId('email-input');
    const submitButton = getByTestId('sendOTP-submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(router.push));
  });
});
