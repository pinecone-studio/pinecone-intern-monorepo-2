/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginComponent } from '@/components/login/_components/StepOne';
import { useLoginMutation } from '@/generated';
import { toast } from 'sonner';

// Mock the generated hook
jest.mock('@/generated', () => ({
  useLoginMutation: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useOtpContext
jest.mock('@/components/providers/UserAuthProvider', () => ({
  useOtpContext: () => ({
    setToken: jest.fn(),
    setMe: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockUseLoginMutation = useLoginMutation as jest.MockedFunction<typeof useLoginMutation>;

describe('LoginComponent', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoginMutation.mockReturnValue([mockLogin, { loading: false, error: undefined }] as any);
  });

  it('renders login form', () => {
    render(<LoginComponent />);

    expect(screen.getByTestId('login-container')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission with valid credentials', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      dateOfBirth: '1990-01-01',
    };

    mockLogin.mockResolvedValue({
      data: {
        login: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        variables: {
          input: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
      });
    });
  });

  it('covers error handling in catch block', async () => {
    const mockError = new Error('Login failed');
    mockLogin.mockRejectedValue(mockError);

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            'data-cy': 'login-failed-toast',
            children: 'Login failed',
          }),
        })
      );
    });
  });

  it('covers error handling with non-Error object', async () => {
    const mockError = 'String error';
    mockLogin.mockRejectedValue(mockError);

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            'data-cy': 'login-failed-toast',
            children: 'An error occurred',
          }),
        })
      );
    });
  });

  it('handles admin role redirection', async () => {
    const mockUser = {
      _id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      dateOfBirth: '1990-01-01',
    };

    mockLogin.mockResolvedValue({
      data: {
        login: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for the setTimeout delay (2000ms) plus some buffer
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/admin');
      },
      { timeout: 3000 }
    );
  });

  it('handles user role redirection', async () => {
    const mockUser = {
      _id: '1',
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      dateOfBirth: '1990-01-01',
    };

    mockLogin.mockResolvedValue({
      data: {
        login: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for the setTimeout delay (2000ms) plus some buffer
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/');
      },
      { timeout: 3000 }
    );
  });

  it('handles unknown role redirection', async () => {
    const mockUser = {
      _id: '1',
      email: 'unknown@example.com',
      firstName: 'Unknown',
      lastName: 'User',
      role: 'unknown',
      dateOfBirth: '1990-01-01',
    };

    mockLogin.mockResolvedValue({
      data: {
        login: {
          user: mockUser,
          token: 'mock-token',
        },
      },
    });

    render(<LoginComponent />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'unknown@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Wait for the setTimeout delay (2000ms) plus some buffer
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/');
      },
      { timeout: 3000 }
    );
  });
});
