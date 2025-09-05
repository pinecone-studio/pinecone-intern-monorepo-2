import { render, screen, fireEvent } from '@testing-library/react';
import { Step2FormFields } from '../../../src/components/signup/Step2FormFields';

const mockProps = {
  register: jest.fn(() => ({ name: 'test', onChange: jest.fn(), onBlur: jest.fn() })),
  formState: {
    errors: {},
    isDirty: true,
  },
  showPassword: false,
  setShowPassword: jest.fn(),
  showConfirmPassword: false,
  setShowConfirmPassword: jest.fn(),
  loading: false,
};

describe('Step2FormFields Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render password form fields correctly', () => {
    render(<Step2FormFields {...mockProps} />);

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    render(<Step2FormFields {...mockProps} />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const eyeIcon = screen.getByTestId('password-toggle');
    fireEvent.click(eyeIcon);

    expect(mockProps.setShowPassword).toHaveBeenCalledWith(true);
  });

  it('should toggle confirm password visibility when eye icon is clicked', () => {
    render(<Step2FormFields {...mockProps} />);

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    const confirmEyeIcon = screen.getByTestId('confirmPassword-toggle');
    fireEvent.click(confirmEyeIcon);

    expect(mockProps.setShowConfirmPassword).toHaveBeenCalledWith(true);
  });

  it('should show password as text when showPassword is true', () => {
    render(<Step2FormFields {...mockProps} showPassword={true} />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should show confirm password as text when showConfirmPassword is true', () => {
    render(<Step2FormFields {...mockProps} showConfirmPassword={true} />);

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('should display password validation error', () => {
    const propsWithError = {
      ...mockProps,
      formState: {
        ...mockProps.formState,
        errors: {
          password: { message: 'Password must be at least 10 characters' },
        },
      },
    };

    render(<Step2FormFields {...propsWithError} />);

    expect(screen.getByText('Password must be at least 10 characters')).toBeInTheDocument();
  });

  it('should display confirm password validation error', () => {
    const propsWithError = {
      ...mockProps,
      formState: {
        ...mockProps.formState,
        errors: {
          confirmPassword: { message: 'Passwords do not match' },
        },
      },
    };

    render(<Step2FormFields {...propsWithError} />);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should display root error', () => {
    const propsWithError = {
      ...mockProps,
      formState: {
        ...mockProps.formState,
        errors: {
          root: { message: 'General form error' },
        },
      },
    };

    render(<Step2FormFields {...propsWithError} />);

    expect(screen.getByText('General form error')).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    render(<Step2FormFields {...mockProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when form is not dirty', () => {
    const propsNotDirty = {
      ...mockProps,
      formState: {
        ...mockProps.formState,
        isDirty: false,
      },
    };

    render(<Step2FormFields {...propsNotDirty} />);

    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show loading text when loading', () => {
    render(<Step2FormFields {...mockProps} loading={true} />);

    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
  });

  it('should show continue text when not loading', () => {
    render(<Step2FormFields {...mockProps} loading={false} />);

    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
