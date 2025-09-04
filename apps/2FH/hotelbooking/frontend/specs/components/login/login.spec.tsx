'use client';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginDocument } from '@/generated';
import { LoginComponent } from '@/components/login/_components/StepOne';
import { UserAuthProvider } from '@/components/providers/UserAuthProvider';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const mockPush = jest.fn();
beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  localStorage.clear();
  jest.clearAllMocks();
});

const email = 'test@example.com';
const password = 'password123';
const token = 'mock-token';

const loginSuccessMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: { data: { login: { token, user: { firstName: 'John', email } } } },
};
const loginNoTokenMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: { data: { login: { token: null, user: { firstName: 'John', email } } } },
};
const loginErrorMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  error: new Error('Invalid credentials'),
};

// --- Helpers ---
const renderLogin = (mocks: MockedResponse[]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserAuthProvider>
        <LoginComponent />
      </UserAuthProvider>
    </MockedProvider>
  );

const fillFormAndSubmit = async (getByTestId: any) => {
  fireEvent.change(getByTestId('email-input'), { target: { value: email } });
  fireEvent.change(getByTestId('password-input'), { target: { value: password } });
  await act(async () => fireEvent.click(getByTestId('submit-button')));
};

describe('LoginComponent', () => {
  it('renders login form', () => {
    const { getByTestId, getByText } = renderLogin([]);
    expect(getByTestId('email-input')).toBeInTheDocument();
    expect(getByTestId('password-input')).toBeInTheDocument();
    expect(getByText(/login/i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    const { getByTestId } = renderLogin([]);
    const input = getByTestId('password-input') as HTMLInputElement;
    const btn = getByTestId('toggle-password');
    expect(input.type).toBe('password');
    fireEvent.click(btn);
    expect(input.type).toBe('text');
  });

  it('logs in successfully and redirects', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderLogin([loginSuccessMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/');
    jest.useRealTimers();
  });

  it('shows error toast on server failure', async () => {
    const { getByTestId } = renderLogin([loginErrorMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('shows error when no token returned', async () => {
    const { getByTestId } = renderLogin([loginNoTokenMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
