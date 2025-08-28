import { useOtpContext } from '@/components/providers';
import { EnterEmail } from '@/components/signup/_components/EnterEmail';
import { SendOtpDocument } from '@/generated';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockSetEmail = jest.fn();
const mockSetStep = jest.fn();
const mockSetStartTime = jest.fn();
const userMockEmail = 'test@example.com';
const sendOtpMock: MockedResponse = {
  request: {
    query: SendOtpDocument,
    variables: {
      email: userMockEmail,
    },
  },
  result: {
    data: {
      sendOtp: {
        message: 'OTP sent',
      },
    },
  },
};

const errorCreateUserEmail = {
  request: {
    query: SendOtpDocument,
    variables: {
      email: userMockEmail,
    },
  },
  error: new Error('Enter email error'),
};

jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));
describe('EnterEmail component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOtpContext as jest.Mock).mockReturnValue({
      email: userMockEmail,
      setEmail: mockSetEmail,
      setStep: mockSetStep,
      setStartTime: mockSetStartTime,
    });
  });

  it('1. IT should create email successfully.', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[sendOtpMock]}>
        <EnterEmail />
      </MockedProvider>
    );
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const nextBtn = getByTestId('create-user-email-button');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'e-mail@example.com' } });
      fireEvent.click(nextBtn);
    });
    await waitFor(() => expect(emailInput.value).toBe(userMockEmail));
    await waitFor(() => expect(mockSetEmail));
    await waitFor(() => expect(mockSetStep).toHaveBeenCalledWith(2));
    await waitFor(() => expect(mockSetStartTime).toHaveBeenCalledWith(true));
  });

  it('2. It should throw new error', async () => {
    const { getByTestId, findByText } = render(
      <MockedProvider mocks={[errorCreateUserEmail]}>
        <EnterEmail />
      </MockedProvider>
    );

    const nextBtn = getByTestId('create-user-email-button');
    act(() => {
      fireEvent.click(nextBtn);
    });

    expect(await findByText('Enter email error')).toBeInTheDocument();
  });
});
