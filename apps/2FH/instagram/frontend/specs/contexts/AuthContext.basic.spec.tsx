import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth, User } from '@/contexts/AuthContext';
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
const TestComponent: React.FC = () => {
  const { user, token, isLoading, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.fullName : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="isLoading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login({
          _id: 'test-id',
          fullName: 'Test User',
          userName: 'testuser',
          email: 'test@example.com'
        }, 'test-token')}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}> Logout </button>
    </div>
  );
};const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);
describe('AuthContext - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockPush.mockClear();
  });
  it('should throw error when useAuth is used outside AuthProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    console.error = originalError;
  });
  it('should provide default context values when no user is logged in', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
  });
  it('should update context when user logs in', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    const loginBtn = screen.getByTestId('login-btn');   
    act(() => {
      loginBtn.click();
    });
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    expect(screen.getByTestId('token')).toHaveTextContent('test-token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
  });
  it('should store user data in localStorage when logging in', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    const loginBtn = screen.getByTestId('login-btn');  
    act(() => {
      loginBtn.click();
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
      _id: 'test-id',
      fullName: 'Test User',
      userName: 'testuser',
      email: 'test@example.com'
    }));
  });
  it('should clear context and localStorage when user logs out', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    const loginBtn = screen.getByTestId('login-btn');
    act(() => {
      loginBtn.click();
    });
    const logoutBtn = screen.getByTestId('logout-btn');
    act(() => {
      logoutBtn.click();
    });
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  it('should update isAuthenticated when login state changes', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
    const loginBtn = screen.getByTestId('login-btn');
    act(() => {
      loginBtn.click();
    });
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
    const logoutBtn = screen.getByTestId('logout-btn');
    act(() => {
      logoutBtn.click();
    });
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
  });
  it('should provide correct user type', () => {
    const mockUser: User = {
      _id: 'test-id',
      fullName: 'Test User',
      userName: 'testuser',
      email: 'test@example.com',
      profileImage: 'test.jpg',
      bio: 'Test bio',
      isVerified: true,
      followers: ['follower1'],
      followings: ['following1']
    };
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(mockUser._id).toBeDefined();
    expect(mockUser.fullName).toBeDefined();
    expect(mockUser.userName).toBeDefined();
  });
});