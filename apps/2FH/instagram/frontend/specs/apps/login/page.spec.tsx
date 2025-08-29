/* eslint-disable max-lines */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LoginPage from '../../../src/app/login/page';
import { AuthProvider } from '../../../src/contexts/AuthContext';

const mockPush = jest.fn();
const mockLoginUser = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/login',
}));

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  useMutation: () => [mockLoginUser, { loading: false }],
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

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
  });

  it('should display the login form with correct elements', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Username, phone number, or email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    
    expect(screen.getByText('Log in')).toBeInTheDocument();
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should not call login when submitting empty form', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should not call login when identifier is missing', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should not call login when password is missing', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should call login mutation when form is valid', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).toHaveBeenCalledWith({
      variables: {
        input: {
          identifier: 'test@example.com',
          password: 'password123'
        }
      }
    });
  });

  it('should handle input changes after validation attempt', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.click(submitButton);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should have correct link attributes', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );
    
    const forgotPasswordLink = screen.getByText('Forgot password?');
    const signUpLink = screen.getByText('Sign Up');
    
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });
});