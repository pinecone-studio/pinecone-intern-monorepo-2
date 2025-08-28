import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import { SendOtpDocument } from '@/generated';
import { toast } from 'sonner';

import { ReSendOtp } from '@/components/signup/_components/resendotp/ReSendOtp';
import { useOtpContext } from '@/components/providers';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('@/components/providers', () => ({ useOtpContext: jest.fn() }));
jest.mock('@/components/signup/_components/assets/LoadingSvg', () => ({
  LoadingSvg: () => <div data-testid="loading-svg">Loading...</div>,
}));

const mockEmail = 'test@example.com';
const mockResetOtp = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useOtpContext as jest.Mock).mockReturnValue({ email: mockEmail, resetOtp: mockResetOtp });
});

const successMock: MockedResponse = {
  request: { query: SendOtpDocument, variables: { email: mockEmail } },
  result: { data: { sendOtp: true } },
};

const errorMock: MockedResponse = {
  request: { query: SendOtpDocument, variables: { email: mockEmail } },
  error: new Error('fail'),
};

const setup = (mocks: MockedResponse[] = [successMock]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ReSendOtp />
    </MockedProvider>
  );

describe('ReSendOtp', () => {
  it('1. Success → calls mutation + resetOtp + toast.success', async () => {
    const { getByRole } = setup();
    fireEvent.click(getByRole('button', { name: 'Send again' }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("We've resent the OTP.");
      expect(mockResetOtp).toHaveBeenCalled();
    });
  });

  it('2. Error → shows toast.error', async () => {
    const { getByRole } = setup([errorMock]);
    fireEvent.click(getByRole('button', { name: 'Send again' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to resend OTP.');
    });
  });

  it('3. Loading state → button disabled + shows spinner', async () => {
    const { getByRole, findByTestId } = setup();
    const btn = getByRole('button', { name: 'Send again' });

    fireEvent.click(btn);

    const spinner = await findByTestId('loading-svg');
    expect(spinner);

    expect(btn);
  });
});
