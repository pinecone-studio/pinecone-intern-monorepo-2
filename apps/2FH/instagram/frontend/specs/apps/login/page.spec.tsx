import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../../../src/app/login/page';

const mockPush = jest.fn();
const mockLoginUser = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  useMutation: () => [mockLoginUser, { loading: false }],
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<LoginPage />);
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
  });

  it('should display the login form with correct elements', () => {
    render(<LoginPage />);
    
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Username, phone number, or email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    
    expect(screen.getByText('Log in')).toBeInTheDocument();
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should not call login when submitting empty form', () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should not call login when identifier is missing', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should not call login when password is missing', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('should call login mutation when form is valid', async () => {
    render(<LoginPage />);
    
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
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Username, phone number, or email') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.click(submitButton);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should have correct link attributes', () => {
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByText('Forgot password?');
    const signUpLink = screen.getByText('Sign Up');
    
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });
});