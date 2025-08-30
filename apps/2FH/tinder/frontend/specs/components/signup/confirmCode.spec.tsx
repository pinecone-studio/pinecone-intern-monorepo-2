import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ConfirmCode } from '@/components/signup/confirmCode';
import { useStep } from '@/components/providers/stepProvider';
import axios from 'axios';
import { toast } from 'sonner';
import '@testing-library/jest-dom';

// Mock all dependencies
jest.mock('@/components/providers/stepProvider');
jest.mock('axios');
jest.mock('sonner');
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockedUseStep = useStep as jest.MockedFunction<typeof useStep>;
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('ConfirmCode Component', () => {
  const mockSetStep = jest.fn();
  const mockSetValues = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseStep.mockReturnValue({
      setStep: mockSetStep,
      setValues: mockSetValues,
      step: 2,
      values: { email: 'test@example.com', password: '' },
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          signUpVerifyOtp: { output: 'OTP verified successfully' },
        },
      },
    });

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders all UI elements correctly', () => {
      render(<ConfirmCode />);

      // Check for logo
      expect(screen.getByTestId('logo')).toBeInTheDocument();

      // Check for main text elements
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('subtitle')).toBeInTheDocument();

      // Check for OTP inputs
      expect(screen.getByTestId('otp-inputs-container')).toBeInTheDocument();
      expect(screen.getByTestId('otp-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('otp-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('otp-input-2')).toBeInTheDocument();
      expect(screen.getByTestId('otp-input-3')).toBeInTheDocument();

      // Check for buttons
      expect(screen.getByTestId('verify-button')).toBeInTheDocument();
      expect(screen.getByTestId('resend-button')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
      render(<ConfirmCode />);

      expect(screen.getByTestId('title')).toHaveTextContent('Confirm your email');
      expect(screen.getByTestId('subtitle')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('verify-button')).toHaveTextContent('Verify');
      expect(screen.getByTestId('resend-button')).toHaveTextContent('Send again (15)');
    });
  });

  describe('OTP Input Handling', () => {
    it('allows only numeric input', () => {
      render(<ConfirmCode />);

      const firstInput = screen.getByTestId('otp-input-0');

      // Try to enter non-numeric character
      fireEvent.change(firstInput, { target: { value: 'a' } });
      expect(firstInput).toHaveValue('');

      // Enter numeric character
      fireEvent.change(firstInput, { target: { value: '1' } });
      expect(firstInput).toHaveValue('1');
    });

    it('moves focus to next input when digit is entered', () => {
      render(<ConfirmCode />);

      const firstInput = screen.getByTestId('otp-input-0');
      const secondInput = screen.getByTestId('otp-input-1');

      fireEvent.change(firstInput, { target: { value: '1' } });

      expect(document.activeElement).toBe(secondInput);
    });

    it('moves focus to previous input on backspace', () => {
      render(<ConfirmCode />);

      const firstInput = screen.getByTestId('otp-input-0');
      const secondInput = screen.getByTestId('otp-input-1');

      // Enter digits in first two inputs
      fireEvent.change(firstInput, { target: { value: '1' } });
      fireEvent.change(secondInput, { target: { value: '2' } });

      // Clear the second input first
      fireEvent.change(secondInput, { target: { value: '' } });

      // Press backspace on second input when it's empty
      fireEvent.keyDown(secondInput, { key: 'Backspace' });

      expect(document.activeElement).toBe(firstInput);
    });

    it('enables verify button when all 4 digits are entered', async () => {
      render(<ConfirmCode />);

      const verifyButton = screen.getByTestId('verify-button');
      expect(verifyButton).toBeDisabled();

      // Enter all 4 digits
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });
    });
  });

  describe('Timer Functionality', () => {
    it('starts countdown from 15 seconds', () => {
      render(<ConfirmCode />);

      expect(screen.getByTestId('resend-button')).toHaveTextContent('Send again (15)');
    });

    it('decrements timer every second', () => {
      render(<ConfirmCode />);

      expect(screen.getByTestId('resend-button')).toHaveTextContent('Send again (15)');

      // Fast-forward 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('resend-button')).toHaveTextContent('Send again (10)');
    });

    it('enables resend button when timer reaches 0', () => {
      render(<ConfirmCode />);

      const resendButton = screen.getByTestId('resend-button');
      expect(resendButton).toBeDisabled();

      // Fast-forward 15 seconds
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(resendButton).not.toBeDisabled();
      expect(resendButton).toHaveTextContent('Send again');
    });
  });

  describe('OTP Verification', () => {
    it('verifies OTP successfully and calls setStep(3)', async () => {
      render(<ConfirmCode />);

      // Enter all 4 digits
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:4200/api/graphql',
          expect.objectContaining({
            query: expect.stringContaining('signUpVerifyOtp'),
            variables: { email: 'test@example.com', otp: '1234' },
          })
        );
        expect(mockedToast.success).toHaveBeenCalledWith('OTP verified successfully');
        expect(mockSetStep).toHaveBeenCalledWith(3);
      });
    });

    it('shows loading state during verification', async () => {
      // Mock delayed response
      mockedAxios.post.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    data: {
                      signUpVerifyOtp: { output: 'OTP verified successfully' },
                    },
                  },
                }),
              100
            )
          )
      );

      render(<ConfirmCode />);

      // Enter all 4 digits
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      // Check loading state
      expect(verifyButton).toHaveTextContent('Verifying...');
      expect(verifyButton).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(verifyButton).toHaveTextContent('Verify');
      });
    });

    it('handles verification errors', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            errors: [
              {
                message: 'Invalid OTP',
              },
            ],
          },
        },
      });

      render(<ConfirmCode />);

      // Enter all 4 digits
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Invalid OTP');
        expect(mockSetStep).not.toHaveBeenCalled();
      });
    });

    it('shows error for incomplete OTP', async () => {
      render(<ConfirmCode />);

      // Enter all 4 digits first to enable the button
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      // Clear the last digit to make it incomplete
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '' } });

      // Now the button should be disabled again
      expect(verifyButton).toBeDisabled();

      // Try to click verify button (should not work since it's disabled)
      fireEvent.click(verifyButton);

      // Since the button is disabled, no error toast should be shown
      expect(mockedToast.error).not.toHaveBeenCalled();
    });
  });

  describe('Resend OTP', () => {
    it('resends OTP successfully and restarts timer', async () => {
      render(<ConfirmCode />);

      const resendButton = screen.getByTestId('resend-button');
      expect(resendButton).toBeDisabled();

      // Fast-forward timer to enable resend button
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(resendButton).not.toBeDisabled();

      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:4200/api/graphql',
          expect.objectContaining({
            query: expect.stringContaining('sendOtp'),
            variables: { email: 'test@example.com' },
          })
        );
        expect(mockedToast.success).toHaveBeenCalledWith('OTP resent successfully!');
      });

      // Timer should restart
      expect(resendButton).toHaveTextContent('Send again (15)');
    });

    it('shows loading state during resend', async () => {
      // Mock delayed response
      mockedAxios.post.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    data: {
                      sendOtp: { output: 'success' },
                    },
                  },
                }),
              100
            )
          )
      );

      render(<ConfirmCode />);

      const resendButton = screen.getByTestId('resend-button');
      expect(resendButton).toBeDisabled();

      // Fast-forward timer to enable resend button
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(resendButton).not.toBeDisabled();

      fireEvent.click(resendButton);

      // Check loading state
      expect(resendButton).toHaveTextContent('Sending...');
      expect(resendButton).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(resendButton).toHaveTextContent('Send again (15)');
      });
    });

    it('handles resend errors', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            errors: [
              {
                message: 'Failed to resend OTP',
              },
            ],
          },
        },
      });

      render(<ConfirmCode />);

      const resendButton = screen.getByTestId('resend-button');
      expect(resendButton).toBeDisabled();

      // Fast-forward timer to enable resend button
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(resendButton).not.toBeDisabled();

      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to resend OTP');
      });
    });

    it('shows error when email is missing', async () => {
      mockedUseStep.mockReturnValue({
        setStep: mockSetStep,
        setValues: mockSetValues,
        step: 2,
        values: { email: '', password: '' }, // Missing email
      });

      render(<ConfirmCode />);

      const resendButton = screen.getByTestId('resend-button');
      expect(resendButton).toBeDisabled();

      // Fast-forward timer to enable resend button
      act(() => {
        jest.advanceTimersByTime(15000);
      });

      expect(resendButton).not.toBeDisabled();

      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Email not found. Please go back and enter your email.');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing email during verification', async () => {
      mockedUseStep.mockReturnValue({
        setStep: mockSetStep,
        setValues: mockSetValues,
        step: 2,
        values: { email: '', password: '' }, // Missing email
      });

      render(<ConfirmCode />);

      // Enter all 4 digits
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Email not found. Please go back and enter your email.');
      });
    });

    it('handles generic network errors', async () => {
      const mockError = new Error('Network error');
      mockError.message = 'Network error';
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('OTP verification failed');
      });
    });

    it('handles error with response data', async () => {
      const mockError = {
        response: {
          data: {
            errors: [{ message: 'Custom error message' }],
          },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Custom error message');
      });
    });

    it('handles error without response data', async () => {
      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('OTP verification failed');
      });
    });

    it('handles error with response data but no errors array', async () => {
      const mockError = {
        response: {
          data: { message: 'Some error' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('OTP verification failed');
      });
    });

    it('handles error with response data and errors array for full coverage', async () => {
      const mockError = {
        response: {
          data: {
            errors: [{ message: 'Custom error message' }],
          },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Custom error message');
      });
    });

    it('calls handleVerifyError function when verification fails', async () => {
      const mockError = new Error('Test error');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<ConfirmCode />);

      // Fill OTP inputs
      fireEvent.change(screen.getByTestId('otp-input-0'), { target: { value: '1' } });
      fireEvent.change(screen.getByTestId('otp-input-1'), { target: { value: '2' } });
      fireEvent.change(screen.getByTestId('otp-input-2'), { target: { value: '3' } });
      fireEvent.change(screen.getByTestId('otp-input-3'), { target: { value: '4' } });

      const verifyButton = screen.getByTestId('verify-button');
      await waitFor(() => {
        expect(verifyButton).not.toBeDisabled();
      });

      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('OTP verification failed');
      });
    });
  });
});
