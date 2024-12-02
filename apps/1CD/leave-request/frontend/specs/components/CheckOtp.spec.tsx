import SendOtp from '@/components/AuthComponents/SendOtp';
import { LoginProvider } from '@/context/LoginContext';
import { CheckOtpDocument } from '@/generated';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, waitFor } from '@testing-library/react';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mocked GraphQL response for valid OTP
const checkOtpMock: MockedResponse = {
  request: {
    query: CheckOtpDocument,
    variables: { email: 'test@example.com', otp: '1234' },
  },
  result: {
    data: {
      checkOTP: 'valid-token',
      __typename: 'CreatesOTP',
    },
  },
};

// Mocking the useRouter hook from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SendOtp Component', () => {
  it('should render OTP input fields correctly', () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[checkOtpMock]} addTypename={false}>
        <LoginProvider>
          <SendOtp />
        </LoginProvider>
      </MockedProvider>
    );

    const modal = getByTestId('check-otp-modal');
    expect(modal);
  });



  it('should display loading state while verifying OTP', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={[checkOtpMock]} addTypename={false}>
        <LoginProvider>
          <SendOtp />
        </LoginProvider>
      </MockedProvider>
    );

    // Simulate entering OTP
    const otpInput = getByTestId('otp-input');
    fireEvent.change(otpInput, { target: { value: '1234' } });

    // Check if the loading message is displayed during verification
    await waitFor(() => {
      expect(getByText('Verifying OTP...'));
    });
  });


});
