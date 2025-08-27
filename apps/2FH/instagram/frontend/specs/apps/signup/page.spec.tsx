import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../../src/app/signup/page';

const mockPush = jest.fn();
const mockCreateUser = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  useMutation: () => [mockCreateUser, { loading: false }],
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value: _value }: { children: React.ReactNode; onValueChange?: (_value: string) => void; value?: string }) => (
    <div data-testid="select-mock">
      <select 
        data-testid="gender-select"
        value={_value} 
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}));

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<SignupPage />);
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
  });

  it('should display the signup form with correct elements', () => {
    render(<SignupPage />);
    expect(screen.getByAltText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Sign up to see photos and videos from your friends')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Cookies Policy')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(<SignupPage />);
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('password123');
    expect((fullNameInput as HTMLInputElement).value).toBe('Test User');
    expect((usernameInput as HTMLInputElement).value).toBe('testuser');
  });

  it('should validate form inputs before submission', () => {
    render(<SignupPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    
    fireEvent.click(submitButton);
    expect(mockCreateUser).not.toHaveBeenCalled();
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.click(submitButton);
    expect(mockCreateUser).not.toHaveBeenCalled();
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(fullNameInput, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('should call create user mutation when form is valid', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const fullNameInput = screen.getByPlaceholderText('Full Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(fullNameInput, 'Test User');
    await user.type(usernameInput, 'testuser');
    
    const genderSelect = screen.getByTestId('gender-select');
    await user.selectOptions(genderSelect, 'OTHER');
    
    await user.click(submitButton);
    
    expect(mockCreateUser).toHaveBeenCalledWith({
      variables: {
        input: {
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User',
          userName: 'testuser',
          gender: 'OTHER'
        }
      }
    });
  });

  it('should have correct link attributes', () => {
    render(<SignupPage />);
    expect(screen.getByText('Log in').closest('a')).toHaveAttribute('href', '/login');
    expect(screen.getByText('Terms').closest('a')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('Cookies Policy').closest('a')).toHaveAttribute('href', '/cookies');
    expect(screen.getByText('Learn More').closest('a')).toHaveAttribute('href', '/help/learn-more');
  });
});