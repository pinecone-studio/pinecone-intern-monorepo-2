import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Step2 } from '../../../src/components/signup/step2';
import { StepProvider, useStep } from '../../../src/components/providers/stepProvider';
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
const Step2WithProvider = () => (
  <StepProvider>
    <Step2 />
  </StepProvider>
);

// Test component that sets up the context properly
const TestStep2WithEmail = () => {
  const { setValues } = useStep();

  useEffect(() => {
    setValues({ email: 'test@example.com', password: '' });
  }, [setValues]);

  return <Step2 />;
};

const Step2WithEmailProvider = () => (
  <StepProvider>
    <TestStep2WithEmail />
  </StepProvider>
);

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('Step2 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.error = jest.fn();
    mockedToast.success = jest.fn();
  });

  it('renders the component correctly', () => {
    render(<Step2WithEmailProvider />);

    expect(screen.getByText('Create password')).toBeInTheDocument();
    expect(screen.getByText(/Use a minimum of 10 characters/)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('shows password requirements', () => {
    render(<Step2WithEmailProvider />);

    // Password requirements are shown in the description text
    expect(screen.getByText(/Use a minimum of 10 characters/)).toBeInTheDocument();
    expect(screen.getByText(/including uppercase letters, lowercase letters, and numbers/)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const togglePasswordButton = screen.getAllByAltText('eye')[0];
    const toggleConfirmPasswordButton = screen.getAllByAltText('eye')[1];

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    await user.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Toggle back to hidden
    await user.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Focus and blur password input to trigger validation
    await user.click(passwordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Enter your password')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for empty confirm password', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Focus and blur confirm password input to trigger validation
    await user.click(confirmPasswordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Enter your confirm password')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for password too short', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Type a short password
    await user.type(passwordInput, 'short');

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for password without required characters', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Type a password that's long enough but missing required characters
    await user.type(passwordInput, 'password123');

    await waitFor(() => {
      expect(screen.getByText('Password must include uppercase, lowercase, and number')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for mismatched passwords', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Type valid password
    await user.type(passwordInput, 'Password123');

    // Type different confirm password
    await user.type(confirmPasswordInput, 'DifferentPassword123');

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Type valid password
    await user.type(passwordInput, 'Password123');

    // Type matching confirm password
    await user.type(confirmPasswordInput, 'Password123');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('successfully creates account and navigates', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          createUser: 'SUCCESS',
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');

    await user.click(submitButton);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:4200/api/graphql',
      {
        query: expect.stringContaining('CreateUser'),
        variables: { email: 'test@example.com', password: 'Password123' },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith('User created successfully');
    });
  });

  it('handles account creation error', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          createUser: 'ERROR',
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
    });
  });

  it('handles API error during account creation', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      response: {
        data: {
          errors: [{ message: 'Network error' }],
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
    });
  });

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup();

    // Create a promise that we can control
    let resolvePromise;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.post.mockReturnValueOnce(pendingPromise);

    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');

    await user.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    });

    // Resolve the promise
    resolvePromise({
      data: {
        data: {
          createUser: 'SUCCESS',
        },
      },
    });
  });

  it('shows error when email is missing from context', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form
    await user.type(passwordInput, 'Password123');
    await user.type(confirmPasswordInput, 'Password123');

    await user.click(submitButton);

    // Should show error since email is missing from context
    expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
  });

  it('validates password strength correctly', async () => {
    const user = userEvent.setup();
    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Test various password combinations
    const testCases = [
      { password: 'weak', expectedError: 'Password must be at least 8 characters' },
      { password: 'password123', expectedError: 'Password must include uppercase, lowercase, and number' },
      { password: 'Password123', expectedError: null }, // Valid password
      { password: 'PASSWORD123', expectedError: 'Password must include uppercase, lowercase, and number' },
      { password: 'passwordABC', expectedError: 'Password must include uppercase, lowercase, and number' },
    ];

    for (const testCase of testCases) {
      // Clear previous input
      await user.clear(passwordInput);

      // Type password
      await user.type(passwordInput, testCase.password);

      if (testCase.expectedError) {
        await waitFor(() => {
          expect(screen.getByText(testCase.expectedError)).toBeInTheDocument();
        });
        expect(submitButton).toBeDisabled();
      } else {
        await waitFor(() => {
          expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
        });
      }
    }
  });

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          createUser: 'SUCCESS',
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Step2WithEmailProvider />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // Fill in form with valid data
    await user.type(passwordInput, 'StrongPassword123');
    await user.type(confirmPasswordInput, 'StrongPassword123');

    // Submit form
    await user.click(submitButton);

    // Verify API call
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:4200/api/graphql',
      {
        query: expect.stringContaining('CreateUser'),
        variables: { email: 'test@example.com', password: 'StrongPassword123' },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Verify success message
    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith('User created successfully');
    });
  });
});
