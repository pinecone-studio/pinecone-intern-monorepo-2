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

describe('Step1 Component - Network Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle network errors', async () => {
    mockAxios.post.mockRejectedValue(new Error('Network error'));

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Wait for form validation to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  it('should handle network errors with response data', async () => {
    const mockError = new Error('Network error');
    (mockError as any).response = {
      data: {
        errors: [{ message: 'Server validation error' }],
      },
    };
    mockAxios.post.mockRejectedValue(mockError);

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Server validation error');
    });
  });

  it('should handle successful submission without GraphQL errors', async () => {
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          signupSendOtp: {
            output: '1234',
          },
        },
        // No errors array - this should trigger the else branch of line 75
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
      expect(mockAxios.post).toHaveBeenCalled();
    });
  });
});
