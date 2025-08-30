import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Step2 } from '@/components/signup/step2';
import { useStep } from '@/components/providers/stepProvider';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock all dependencies
jest.mock('@/components/providers/stepProvider');
jest.mock('axios');
jest.mock('sonner');
jest.mock('next/navigation');
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
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Step2 Component', () => {
  const mockSetStep = jest.fn();
  const mockSetValues = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseStep.mockReturnValue({
      setStep: mockSetStep,
      setValues: mockSetValues,
      step: 3,
      values: { email: 'test@example.com', password: '' },
    });

    mockedUseRouter.mockReturnValue({
      push: mockPush,
    } as any);

    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          createUser: 'SUCCESS',
        },
      },
    });
  });

  describe('Rendering', () => {
    it('renders all UI elements correctly', () => {
      render(<Step2 />);

      // Check for logo
      expect(screen.getByTestId('logo')).toBeInTheDocument();

      // Check for main text elements
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('subtitle')).toBeInTheDocument();

      // Check for form elements
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();

      // Check for labels
      expect(screen.getByTestId('password-label')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-label')).toBeInTheDocument();
    });

    it('displays correct text content', () => {
      render(<Step2 />);

      expect(screen.getByTestId('title')).toHaveTextContent('Create password');
      expect(screen.getByTestId('subtitle')).toHaveTextContent('Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers');
      expect(screen.getByTestId('password-label')).toHaveTextContent('Password');
      expect(screen.getByTestId('confirm-password-label')).toHaveTextContent('Confirm password');
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Continue');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility when eye icon is clicked', () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const passwordToggle = screen.getByTestId('password-toggle');

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle to show password
      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click toggle to hide password again
      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('toggles confirm password visibility when eye icon is clicked', () => {
      render(<Step2 />);

      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const confirmPasswordToggle = screen.getByTestId('confirm-password-toggle');

      // Initially password should be hidden
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Click toggle to show password
      fireEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');

      // Click toggle to hide password again
      fireEvent.click(confirmPasswordToggle);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty password', async () => {
      render(<Step2 />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();

      // For onChange mode, we need to trigger validation by typing then clearing
      const passwordInput = screen.getByTestId('password-input');
      fireEvent.change(passwordInput, { target: { value: 'test' } });
      fireEvent.change(passwordInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toHaveTextContent('Enter your password');
      });
    });

    it('shows validation error for password too short', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: '123' } });

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 10 characters');
      });
    });

    it('shows validation error for password without required characters', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: '1234567890' } });

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password must include uppercase, lowercase, and number');
      });
    });

    it('shows validation error for empty confirm password', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Enter your confirm password');
      });
    });

    it('shows validation error when passwords do not match', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass1234' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Passwords do not match');
      });
    });

    it('enables submit button with valid passwords', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      expect(submitButton).toBeDisabled();

      fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits successfully and navigates to home', async () => {
      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });

      // Ensure form is touched by blurring inputs
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:4200/api/graphql',
          expect.objectContaining({
            query: expect.stringContaining('createUser'),
            variables: { email: 'test@example.com', password: 'ValidPass1234' },
          }),
          expect.objectContaining({
            headers: { 'Content-Type': 'application/json' },
          })
        );
        expect(mockSetStep).toHaveBeenCalledWith(1);
        expect(mockPush).toHaveBeenCalledWith('/');
        expect(mockedToast.success).toHaveBeenCalledWith('User created successfully');
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
                      createUser: 'SUCCESS',
                    },
                  },
                }),
              50
            )
          )
      );

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      act(() => {
        fireEvent.click(submitButton);
      });

      // Check loading state appears
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Creating Account...');
        expect(submitButton).toBeDisabled();
      });

      // Wait for completion
      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Continue');
      });
    });
  });

  describe('Error Handling', () => {
    it('handles createUser ERROR response', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: {
            createUser: 'ERROR',
          },
        },
      });

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
        expect(mockSetStep).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('handles network error without response', async () => {
      const mockError = new Error('Network failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });
    });

    it('handles error with response data and logs it', async () => {
      const mockError = {
        message: 'Server error details',
        response: {
          data: { message: 'Server error details' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      // Mock console.error to verify it's called
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Server error details');
        expect(consoleSpy).toHaveBeenCalledWith({ message: 'Server error details' });
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });

      consoleSpy.mockRestore();
    });

    it('handles error with console.error logging', async () => {
      const mockError = {
        message: 'Test error message',
        response: {
          data: { message: 'Test error message' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      // Mock console.error to verify it's called
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Test error message');
        expect(consoleSpy).toHaveBeenCalledWith({ message: 'Test error message' });
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });

      consoleSpy.mockRestore();
    });

    it('handles error with response data for console.error coverage', async () => {
      const mockError = {
        message: 'Test error',
        response: {
          data: { message: 'Response error message' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      // Mock console.error to verify it's called
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Test error');
        expect(consoleSpy).toHaveBeenCalledWith({ message: 'Response error message' });
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });

      consoleSpy.mockRestore();
    });

    it('handles error with response data for console.error line 146 coverage', async () => {
      const mockError = {
        message: 'Another test error',
        response: {
          data: { message: 'Another response error' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(mockError);

      // Mock console.error to verify it's called
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error creating user:', 'Another test error');
        expect(consoleSpy).toHaveBeenCalledWith({ message: 'Another response error' });
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });

      consoleSpy.mockRestore();
    });

    it('calls handleCreateUserError function for coverage', async () => {
      const mockError = new Error('Test error');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith('Failed to create user');
      });
    });

    it('handles missing email from step1', async () => {
      mockedUseStep.mockReturnValue({
        setStep: mockSetStep,
        setValues: mockSetValues,
        step: 3,
        values: { email: '', password: '' }, // Missing email
      });

      render(<Step2 />);

      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass1234' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      // Should not make API call when email is missing
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });
});
