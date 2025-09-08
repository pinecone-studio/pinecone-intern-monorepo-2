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
const loginSuccessUserMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: {
    data: {
      login: {
        token,
        user: { _id: '1', firstName: 'John', lastName: 'Doe', email, role: 'user', dateOfBirth: '2000-01-01' },
      },
    },
  },
};
const loginSuccessAdminMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: {
    data: {
      login: {
        token,
        user: { _id: '2', firstName: 'Admin', lastName: 'Boss', email, role: 'admin', dateOfBirth: '1990-01-01' },
      },
    },
  },
};
const loginNoFirstNameMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: {
    data: {
      login: {
        token,
        user: { _id: '4', firstName: '', lastName: 'Doe', email, role: 'user', dateOfBirth: '2000-01-01' },
      },
    },
  },
};
const loginNoTokenMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  result: { data: { login: { token: null, user: { _id: '3', firstName: 'John', email, role: 'user' } } } },
};
const loginErrorMock: MockedResponse = {
  request: { query: LoginDocument, variables: { input: { email, password } } },
  error: new Error('Invalid credentials'),
};
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
    expect(getByText(/sign in/i)).toBeInTheDocument();
  });
  it('toggles password visibility', () => {
    const { getByTestId } = renderLogin([]);
    const input = getByTestId('password-input') as HTMLInputElement;
    const btn = getByTestId('toggle-password');
    expect(input.type).toBe('password');
    fireEvent.click(btn);
    expect(input.type).toBe('text');
  });
  it('logs in successfully as user and redirects to "/"', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderLogin([loginSuccessUserMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/');
    jest.useRealTimers();
  });
  it('logs in successfully as admin and redirects to "/admin"', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderLogin([loginSuccessAdminMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/admin');
    jest.useRealTimers();
  });
  it('redirects to /user-profile if firstName is missing', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderLogin([loginNoFirstNameMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/user-profile');
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
  it('redirects to pending room booking when pendingRoomId exists', async () => {
    jest.useFakeTimers();
    localStorage.setItem('pendingRoomId', 'pending-room-123');
    const { getByTestId } = renderLogin([loginSuccessUserMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/booking/pending-room-123/payment');
    expect(localStorage.getItem('pendingRoomId')).toBeNull();
    jest.useRealTimers();
  });
  it('redirects to normal home when no pendingRoomId exists', async () => {
    jest.useFakeTimers();
    const { getByTestId } = renderLogin([loginSuccessUserMock]);
    await fillFormAndSubmit(getByTestId);
    await waitFor(() => expect(localStorage.getItem('token')).toBe(token));
    expect(toast.success).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(localStorage.getItem('pendingRoomId')).toBeNull();
    jest.useRealTimers();
  });
});
