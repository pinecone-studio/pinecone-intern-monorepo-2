import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../../../src/components/auth/SignUp';
import { useAuth } from '@/components/providers/AuthProvider';
import { jest } from '@jest/globals';

jest.mock('@/components/providers/AuthProvider');

const mockHandleSignUp = jest.fn();
(useAuth as jest.Mock).mockReturnValue({
  handleSignUp: mockHandleSignUp,
  loading: false,
});

describe('SignUp Component', () => {
  it('renders the sign-up form and inputs', () => {
    const { getByTestId } = render(<SignUp />);

    expect(getByTestId('input-email'));
    expect(getByTestId('input-password'));
    expect(getByTestId('input-repeatPassword'));
    expect(getByTestId('Sign-Up-Submit-Button'));
    expect(getByTestId('Sign-In-Link-Button'));
  });

  it('calls handleSignUp when form is submitted with valid data', async () => {
    const { getByTestId } = render(<SignUp />);

    await act(async () => {
      fireEvent.change(getByTestId('input-email'), { target: { value: 'test@example.com' } });
      fireEvent.change(getByTestId('input-password'), { target: { value: 'Password1!' } });
      fireEvent.change(getByTestId('input-repeatPassword'), { target: { value: 'Password1!' } });
      fireEvent.click(getByTestId('Sign-Up-Submit-Button'));
    });
  });

  it('does not call handleSignUp when form is submitted with mismatched passwords', async () => {
    const { getByTestId } = render(<SignUp />);
    await act(async () => {
      fireEvent.change(getByTestId('input-email'), { target: { value: 'test@example.com' } });
      fireEvent.change(getByTestId('input-password'), { target: { value: 'Password1!' } });
      fireEvent.change(getByTestId('input-repeatPassword'), { target: { value: 'DifferentPassword!' } });
      fireEvent.click(getByTestId('Sign-Up-Submit-Button'));
    });
  });
});
it('shows a loading spinner when loading is true', () => {
  // Mock the useAuth hook to return loading: true
  (useAuth as jest.Mock).mockReturnValueOnce({
    handleSignUp: mockHandleSignUp,
    loading: true,
  });
  render(<SignUp />);
});
