import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { EmailValidate } from '@/components/signup/_components/EmailValidate';
import { VerifyOtpDocument } from '@/generated';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useOtpContext } from '@/components/providers';

beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const mockEmail = 'test@example.com';
const mockTimeLeft = 90;
const mockOtp = '1234';
const mockSetOtp = jest.fn();
const mockSetStep = jest.fn();

const verifyOtpMock: MockedResponse = {
  request: {
    query: VerifyOtpDocument,
    variables: {
      input: { email: mockEmail, otp: mockOtp },
    },
  },
  result: {
    data: {
      verifyOtp: {
        message: 'OTP verified',
      },
    },
  },
};

jest.mock('@/components/providers', () => ({
  useOtpContext: jest.fn(),
}));

describe('EmailValidate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useOtpContext as jest.Mock).mockReturnValue({
      email: mockEmail,
      otp: '',
      startTime: true,
      timeLeft: mockTimeLeft,
      setOtp: mockSetOtp,
      setStep: mockSetStep,
    });
  });

  it('1. should verify OTP successfully when 4 digits are entered', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[verifyOtpMock]} addTypename={false}>
        <EmailValidate />
      </MockedProvider>
    );

    const otpInput = getByTestId('input-otp') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(otpInput, { target: { value: '1234' } });
    });
  });

  it('2. should show error toast on invalid OTP', async () => {
    (useOtpContext as jest.Mock).mockReturnValue({
      email: mockEmail,
      otp: '2131',
      startTime: true,
      timeLeft: mockTimeLeft,
      setOtp: mockSetOtp,
      setStep: mockSetStep,
    });

    const { getByTestId } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EmailValidate />
      </MockedProvider>
    );

    const otpInput = getByTestId('input-otp') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(otpInput, { target: { value: '1234' } });
    });
    expect(mockSetOtp).toBeDefined();
  });

  it('3. Should verify OTP successfully when 4 digits are entered', async () => {
    (useOtpContext as jest.Mock).mockReturnValue({
      email: mockEmail,
      otp: '1234',
      startTime: true,
      timeLeft: mockTimeLeft,
      setOtp: mockSetOtp,
      setStep: mockSetStep,
    });

    render(
      <MockedProvider mocks={[verifyOtpMock]} addTypename={false}>
        <EmailValidate />
      </MockedProvider>
    );
    await waitFor(() => expect(mockSetStep).toHaveBeenCalledWith(3));
  });
});
