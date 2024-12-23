// SignIn.test.js
import { render, screen, fireEvent, act } from '@testing-library/react';
import SignIn from '../../../src/components/auth/SignIn';
import { useAuth } from '@/components/providers/AuthProvider';
import '@testing-library/jest-dom';

// Mock the useAuth hook
jest.mock('@/components/providers/AuthProvider');

const mockHandleSignIn = jest.fn();

(useAuth as jest.Mock).mockReturnValue({
  handleSignIn: mockHandleSignIn,
  loading: false,
});

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-in form', () => {
    render(<SignIn />);

    expect(screen.getByTestId('Sign-In-Submit-Button'));
    expect(screen.getByTestId('input-email'));
    expect(screen.getByTestId('input-password'));
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<SignIn />);

    fireEvent.click(screen.getByTestId('Sign-In-Submit-Button'));

    expect(await screen.findByTestId('form-message-email'));
    expect(await screen.findByTestId('form-message-password'));
  });

  it('calls handleSignIn with correct inputs on form submission', async () => {
    render(<SignIn />);

    await act(async () => {
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'P@ssword123' } });

      fireEvent.click(screen.getByTestId('Sign-In-Submit-Button'));
    });
  });
  it('shows a loading spinner when loading is true', () => {
    // Mock the useAuth hook to return loading: true
    (useAuth as jest.Mock).mockReturnValueOnce({
      handleSignIn: mockHandleSignIn,
      loading: true,
    });

    render(<SignIn />);
  });

  it('navigates to the sign-up page when the "бүртгүүлэх" link is clicked', () => {
    render(<SignIn />);
  });
});
