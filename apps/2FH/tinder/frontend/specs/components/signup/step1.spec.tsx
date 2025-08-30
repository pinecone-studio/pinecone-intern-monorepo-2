/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step1 } from '@/components/signup/step1';
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

describe('Step1 Component', () => {
  const mockSetStep = jest.fn();
  const mockSetValues = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseStep.mockReturnValue({
      setStep: mockSetStep,
      setValues: mockSetValues,
      step: 1,
      values: { email: '', password: '' },
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          signupSendOtp: { output: 'success' },
        },
      },
    });
  });

  describe('Rendering', () => {
    it('renders all UI elements correctly', () => {
      render(<Step1 />);

      // Check for logo
      expect(screen.getByTestId('logo')).toBeInTheDocument();

      // Check for main text elements
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('subtitle')).toBeInTheDocument();

      // Check for form elements
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('login-link')).toBeInTheDocument();

      // Check for terms text
      expect(screen.getByTestId('terms-text')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
      render(<Step1 />);

      expect(screen.getByTestId('title')).toHaveTextContent('Create an account');
      expect(screen.getByTestId('subtitle')).toHaveTextContent('Enter your email below to create your account');
      expect(screen.getByTestId('email-label')).toHaveTextContent('Email');
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Continue');
      expect(screen.getByTestId('login-link')).toHaveTextContent('Log in');
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty email', async () => {
      render(<Step1 />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();

      // The button should be disabled when email is empty
      expect(submitButton).toBeDisabled();

      // For onChange mode, validation error appears when user starts typing then clears
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'test' } });
      fireEvent.change(emailInput, { target: { value: '' } });

      // Wait for validation error to appear
      await waitFor(
        () => {
          expect(screen.getByTestId('email-error')).toBeInTheDocument();
          expect(screen.getByTestId('email-error')).toHaveTextContent('Enter your email');
        },
        { timeout: 3000 }
      );
    });

    it('shows validation error for invalid email format', async () => {
      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email address');
      });
    });

    it('enables submit button with valid email', async () => {
      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      expect(submitButton).toBeDisabled();

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits successfully and calls setStep(2)', async () => {
      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:4200/api/graphql',
          expect.objectContaining({
            query: expect.stringContaining('signupSendOtp'),
            variables: { email: 'test@example.com' },
          })
        );
        expect(mockSetValues).toHaveBeenCalled();
        expect(mockSetStep).toHaveBeenCalledWith(2);
      });
    });

    it('shows loading state during submission', async () => {
      // Mock delayed response
      mockedAxios.post.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: {
                    data: {
                      signupSendOtp: { output: 'success' },
                    },
                  },
                }),
              100
            )
          )
      );

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      });

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).toHaveTextContent('Continue');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles "Email is already registered" error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [
            {
              message: 'Email is already registered',
            },
          ],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Email is already registered. Please log in.');
        expect(mockSetStep).not.toHaveBeenCalled();
      });
    });

    it('handles "Failed to send OTP" error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [
            {
              message: 'Failed to send OTP',
            },
          ],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to send OTP. Please try again later.');
        expect(mockSetStep).not.toHaveBeenCalled();
      });
    });

    it('handles server temporarily unavailable error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Server is temporarily unavailable' }],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Server is temporarily unavailable');
      });
    });

    it('handles generic GraphQL error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Some other error' }],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Some other error');
      });
    });

    it('handles network error in catch block', async () => {
      const mockError = {
        response: {
          data: {
            errors: [{ message: 'Network error message' }],
          },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Network error message');
      });
    });

    it('handles network error without response data', async () => {
      const mockError = new Error('Network failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Something went wrong');
      });
    });

    it('handles GraphQL error with empty errors array', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetStep).toHaveBeenCalledWith(2);
      });
    });

    it('handles GraphQL error with undefined errors', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: undefined,
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetStep).toHaveBeenCalledWith(2);
      });
    });

    it('handles GraphQL error with null errors for full coverage', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: null,
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetStep).toHaveBeenCalledWith(2);
      });
    });

    it('calls logGraphQLErrors function for coverage', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Test error message' }],
        },
      });

      render(<Step1 />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Wait for form to become valid
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Test error message');
      });
    });
  });

  describe('Navigation', () => {
    it('renders login link with correct href', () => {
      render(<Step1 />);

      const loginLink = screen.getByTestId('login-link');
      expect(loginLink).toHaveAttribute('href', '/signin');
    });
  });
});
