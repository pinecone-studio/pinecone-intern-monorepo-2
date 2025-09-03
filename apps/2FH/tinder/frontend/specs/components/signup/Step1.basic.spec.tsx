import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step1 } from '../../../src/components/signup/Step1';
import { StepProvider } from '../../../src/components/providers/stepProvider';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

const renderWithProvider = (component: React.ReactElement) => {
  return render(<StepProvider>{component}</StepProvider>);
};

describe('Step1 Component - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.post.mockResolvedValue({
      data: {
        data: {
          signupSendOtp: {
            output: '1234',
          },
        },
      },
    });
  });

  it('should render the signup form correctly', () => {
    renderWithProvider(<Step1 />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Enter your email below to create your account')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('should show validation error for empty email', () => {
    renderWithProvider(<Step1 />);

    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show validation error for invalid email', async () => {
    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toBeDisabled();
  });

  it('should successfully submit valid email', async () => {
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
      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:4200/api/graphql',
        expect.objectContaining({
          query: expect.stringContaining('SignupSendOtp'),
          variables: { email: 'test@example.com' },
        })
      );
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

  it('should show loading spinner when submitting', async () => {
    // Mock a slow response to keep loading state
    mockAxios.post.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithProvider(<Step1 />);

    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: /continue/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    // Check that loading spinner appears (lines 119-123)
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    // Check button styling changes to disabled state
    expect(submitButton).toHaveClass('bg-gray-400', 'cursor-not-allowed');
  });
});
