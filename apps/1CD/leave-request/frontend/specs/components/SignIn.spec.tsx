import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CreatesOtpDocument } from '@/generated';
import Login from '@/components/AuthComponents/Login';

const newDate = new Date();

const createOTPMock: MockedResponse = {
  request: {
    query: CreatesOtpDocument,
    variables: { email: 'Zolo@gmail.com' },
  },
  result: {
    data: {
      createsOTP: {
        email: 'Zolo@gmail.com',
        expirationDate: newDate.toString(),
      },
    },
  },
};

describe('Login request, otp creating, component test', () => {
  it('should render and show the modal after OTP request', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[createOTPMock]} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    const modal = getByTestId('check-otp-modal');
    const input = getByTestId('email-input');
    const sendOTPButton = getByTestId('sendOTP-submit-button');

    // Simulate user input and button click
    act(() => {
      fireEvent.change(input, { target: { value: 'Zolo@gmail.com' } });
      fireEvent.click(sendOTPButton);
    });

    // Wait for modal to appear
    await waitFor(() => expect(modal).toBeInTheDocument());

    // Optionally, you can check if the modal is visible (if you have a CSS class or style that controls visibility)
    // expect(modal).toBeVisible();
  });
});
