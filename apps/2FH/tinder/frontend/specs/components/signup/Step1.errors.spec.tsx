import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step1 } from '../../../src/components/signup/Step1';
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

const mockAxios = axios as jest.Mocked<typeof axios>;

const renderWithProvider = (component: React.ReactElement) => {
  return render(<StepProvider>{component}</StepProvider>);
};

describe('Step1 Component - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle "Failed to send OTP" error', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: { signupSendOtp: { output: '1234' } },
        errors: [{ message: 'Failed to send OTP' }],
      },
    });

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send OTP. Please try again later.');
    });
  });

  it('should handle "Email is already registered" error', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: { signupSendOtp: { output: '1234' } },
        errors: [{ message: 'Email is already registered' }],
      },
    });

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email is already registered. Please log in.');
    });
  });

  it('should handle generic GraphQL errors', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: { signupSendOtp: { output: '1234' } },
        errors: [{ message: 'Some other error' }],
      },
    });

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Some other error');
    });
  });

  it('should handle GraphQL errors with undefined message', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: { signupSendOtp: { output: '1234' } },
        errors: [{ message: undefined }], // Test line 31 fallback case
      },
    });

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });
});
