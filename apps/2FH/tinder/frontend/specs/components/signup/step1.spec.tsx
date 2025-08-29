import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Step1 } from '../../../src/components/signup/step1';
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

jest.mock('next/link', () => {
  const MockedLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockedLink.displayName = 'MockedLink';
  return MockedLink;
});

// Mock the step provider
const mockSetStep = jest.fn();
const mockSetValues = jest.fn();

// Create a wrapper component with StepProvider
const Step1WithProvider = () => (
  <StepProvider>
    <Step1 />
  </StepProvider>
);

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('Step1 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedToast.error = jest.fn();
  });

  it('renders the component correctly', () => {
    render(<Step1WithProvider />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Enter your email below to create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText(/By clicking continue, you agree to our/)).toBeInTheDocument();
  });

  it('displays validation error for empty email', async () => {
    const user = userEvent.setup();
    render(<Step1WithProvider />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    // The button should be disabled initially since form is invalid
    expect(submitButton).toBeDisabled();

    // Try to submit the form to trigger validation
    await user.click(submitButton);

    // Since the button is disabled, the form won't submit, but we can check the form state
    // The validation error should appear in the DOM
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('displays validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<Step1WithProvider />);

    const emailInput = screen.getByPlaceholderText('Enter your email');

    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('enables submit button when valid email is entered', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('successfully submits form and moves to next step', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          signupSendOtp: {
            output: 'success',
          },
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4200/api/graphql', {
      query: expect.stringContaining('signupSendOtp'),
      variables: { email: 'test@example.com' },
    });

    await waitFor(() => {
      expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function));
      expect(mockSetStep).toHaveBeenCalledWith(2);
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

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Should show loading spinner
    expect(screen.getByRole('button')).toHaveClass('bg-gray-400', 'cursor-not-allowed');
    expect(screen.getByRole('button')).toBeDisabled();

    // Resolve the promise
    resolvePromise({
      data: {
        data: {
          signupSendOtp: { output: 'success' },
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();
    });
  });

  it('handles "Email is already registered" error', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      data: {
        errors: [{ message: 'Email is already registered' }],
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockErrorResponse);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'existing@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Email is already registered. Please log in.');
    });

    expect(mockSetStep).not.toHaveBeenCalled();
  });

  it('handles "Failed to send OTP" error', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      data: {
        errors: [{ message: 'Failed to send OTP' }],
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockErrorResponse);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Failed to send OTP. Please try again later.');
    });
  });

  it('handles generic GraphQL errors', async () => {
    const user = userEvent.setup();
    const mockErrorResponse = {
      data: {
        errors: [{ message: 'Some other error' }],
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockErrorResponse);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Some other error');
    });
  });

  it('handles network/axios errors', async () => {
    const user = userEvent.setup();
    const networkError = {
      response: {
        data: {
          errors: [{ message: 'Network error' }],
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(networkError);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Network error');
    });
  });

  it('handles unexpected errors without response data', async () => {
    const user = userEvent.setup();
    const unexpectedError = new Error('Unexpected error');

    mockedAxios.post.mockRejectedValueOnce(unexpectedError);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  it('renders login link correctly', () => {
    render(<Step1 />);

    const loginLink = screen.getByText('Log in');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/signin');
  });

  it('correctly updates values in context', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        data: {
          signupSendOtp: { output: 'success' },
        },
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function));
    });

    // Test the function passed to setValues
    const setValuesCall = mockSetValues.mock.calls[0][0];
    const prevValues = { someField: 'value' };
    const result = setValuesCall(prevValues);

    expect(result).toEqual({
      someField: 'value',
      email: 'test@example.com',
    });
  });

  it('prevents multiple submissions while loading', async () => {
    const user = userEvent.setup();

    let resolvePromise;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.post.mockReturnValueOnce(pendingPromise);

    render(<Step1 />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await user.type(emailInput, 'test@example.com');

    // First click
    await user.click(submitButton);
    expect(submitButton).toBeDisabled();

    // Try to click again while loading
    await user.click(submitButton);

    // Should only be called once
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);

    // Resolve the promise
    resolvePromise({
      data: {
        data: {
          signupSendOtp: { output: 'success' },
        },
      },
    });
  });
});
