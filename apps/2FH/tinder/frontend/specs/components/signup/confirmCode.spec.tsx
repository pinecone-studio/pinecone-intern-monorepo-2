import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ConfirmCode } from '../../../src/components/signup/confirmCode';
import { StepProvider } from '../../../src/components/providers/stepProvider';
import axios from 'axios';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('axios');
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Create a wrapper component with StepProvider
const ConfirmCodeWithProvider = () => (
  <StepProvider>
    <ConfirmCode />
  </StepProvider>
);

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('ConfirmCode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.error = jest.fn();
    mockedToast.success = jest.fn();

    // Mock timer functions
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the component correctly', () => {
    render(<ConfirmCodeWithProvider />);

    expect(screen.getByText('Confirm your email')).toBeInTheDocument();
    expect(screen.getByText(/To continue, enter the secure code we sent to/)).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
    expect(screen.getByText('Send again (15)')).toBeInTheDocument();

    // Check for 4 OTP input fields
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
  });

  it('displays initial timer countdown', () => {
    render(<ConfirmCodeWithProvider />);

    expect(screen.getByText('Send again (15)')).toBeInTheDocument();
  });

  it('handles OTP input correctly', async () => {
    const user = userEvent.setup();
    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');

    // Type in first input
    await user.type(inputs[0], '1');
    expect(inputs[0]).toHaveValue('1');

    // Should auto-focus to next input
    expect(inputs[1]).toHaveFocus();

    // Type in second input
    await user.type(inputs[1], '2');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveFocus();
  });

  it('handles backspace navigation correctly', async () => {
    const user = userEvent.setup();
    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');

    // Type in first two inputs
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');

    // Focus on second input and press backspace
    inputs[1].focus();
    await user.keyboard('{Backspace}');

    // Should focus back to first input
    expect(inputs[0]).toHaveFocus();
  });

  it('only accepts numeric input', async () => {
    const user = userEvent.setup();
    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');

    // Try to type non-numeric characters
    await user.type(inputs[0], 'a');
    expect(inputs[0]).toHaveValue('');

    // Try to type numeric character
    await user.type(inputs[0], '5');
    expect(inputs[0]).toHaveValue('5');
  });

  it('shows error when trying to verify incomplete OTP', async () => {
    const user = userEvent.setup();
    render(<ConfirmCodeWithProvider />);

    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    // Try to verify without entering complete OTP
    await user.click(verifyButton);

    expect(mockedToast.error).toHaveBeenCalledWith('Please enter the 4-digit code.');
  });

  it('shows error when email is missing', async () => {
    const user = userEvent.setup();
    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');
    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    // Fill in OTP but email will be missing from context
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');
    await user.type(inputs[2], '3');
    await user.type(inputs[3], '4');

    await user.click(verifyButton);

    expect(mockedToast.error).toHaveBeenCalledWith('Email not found. Please go back and enter your email.');
  });

  it('successfully verifies OTP and moves to next step', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          signUpVerifyOtp: {
            input: 'test@example.com',
            output: 'success',
          },
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');
    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    // Fill in OTP
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');
    await user.type(inputs[2], '3');
    await user.type(inputs[3], '4');

    await user.click(verifyButton);

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4200/api/graphql', {
      query: expect.stringContaining('signUpVerifyOtp'),
      variables: { email: '', otp: '1234' },
    });

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith('OTP verified successfully!');
    });
  });

  it('handles OTP verification error', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      response: {
        data: {
          errors: [{ message: 'Invalid OTP code' }],
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');
    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    // Fill in OTP
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');
    await user.type(inputs[2], '3');
    await user.type(inputs[3], '4');

    await user.click(verifyButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Invalid OTP code');
    });
  });

  it('shows loading state during verification', async () => {
    const user = userEvent.setup();

    // Create a promise that we can control
    let resolvePromise;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.post.mockReturnValueOnce(pendingPromise);

    render(<ConfirmCodeWithProvider />);

    const inputs = screen.getAllByRole('textbox');
    const verifyButton = screen.getByRole('button', { name: 'Verify' });

    // Fill in OTP
    await user.type(inputs[0], '1');
    await user.type(inputs[1], '2');
    await user.type(inputs[2], '3');
    await user.type(inputs[3], '4');

    await user.click(verifyButton);

    // Should show loading state
    expect(verifyButton).toBeDisabled();
    expect(screen.getByText('Verifying...')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise({
      data: {
        data: {
          signUpVerifyOtp: {
            input: 'test@example.com',
            output: 'success',
          },
        },
      },
    });
  });

  it('handles resend OTP functionality', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          sendOtp: {
            input: 'test@example.com',
            output: 'success',
          },
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<ConfirmCodeWithProvider />);

    const resendButton = screen.getByRole('button', { name: 'Send again (15)' });

    await user.click(resendButton);

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4200/api/graphql', {
      query: expect.stringContaining('sendOtp'),
      variables: { email: '' },
    });

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith('OTP resent successfully!');
    });
  });

  it('handles resend OTP error', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      response: {
        data: {
          errors: [{ message: 'Failed to resend OTP' }],
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

    render(<ConfirmCodeWithProvider />);

    const resendButton = screen.getByRole('button', { name: 'Send again (15)' });

    await user.click(resendButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to resend OTP');
    });
  });

  it('shows resending state during resend', async () => {
    const user = userEvent.setup();

    // Create a promise that we can control
    let resolvePromise;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.post.mockReturnValueOnce(pendingPromise);

    render(<ConfirmCodeWithProvider />);

    const resendButton = screen.getByRole('button', { name: 'Send again (15)' });

    await user.click(resendButton);

    // Should show resending state
    expect(resendButton).toBeDisabled();
    expect(screen.getByText('Resending...')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise({
      data: {
        data: {
          sendOtp: {
            input: 'test@example.com',
            output: 'success',
          },
        },
      },
    });
  });

  it('timer countdown works correctly', () => {
    render(<ConfirmCodeWithProvider />);

    // Initial timer should be 15
    expect(screen.getByText('Send again (15)')).toBeInTheDocument();

    // Fast forward 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Send again (10)')).toBeInTheDocument();

    // Fast forward to 0
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Send again')).toBeInTheDocument();
  });

  it('resets timer after resending OTP', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          sendOtp: {
            input: 'test@example.com',
            output: 'success',
          },
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<ConfirmCodeWithProvider />);

    // Fast forward timer to 5 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Send again (5)')).toBeInTheDocument();

    // Resend OTP
    const resendButton = screen.getByRole('button', { name: 'Send again (5)' });
    await user.click(resendButton);

    // Timer should reset to 15
    await waitFor(() => {
      expect(screen.getByText('Send again (15)')).toBeInTheDocument();
    });
  });
});
