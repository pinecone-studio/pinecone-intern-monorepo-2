import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/providers/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button onClick={() => login('token123', { id: '1', email: 'test@example.com' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('AuthProvider', () => {
    it('renders children without crashing', () => {
      expect(() =>
        render(
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        )
      ).not.toThrow();
    });

    it('provides initial state correctly', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
  });

  describe('useAuth Hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => render(<TestComponent />)).toThrow(
        'useAuth must be used within an AuthProvider'
      );
      
      consoleSpy.mockRestore();
    });

    it('provides login function', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      expect(loginButton).toBeInTheDocument();
    });

    it('provides logout function', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe('Login Functionality', () => {
    it('logs in user and updates state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      
      act(() => {
        fireEvent.click(loginButton);
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as test@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    it('stores token and user data in localStorage', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      
      act(() => {
        fireEvent.click(loginButton);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'token123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ id: '1', email: 'test@example.com' })
      );
    });

    it('calls localStorage.setItem twice during login', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      
      act(() => {
        fireEvent.click(loginButton);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Logout Functionality', () => {
    it('logs out user and updates state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // First login
      const loginButton = screen.getByText('Login');
      act(() => {
        fireEvent.click(loginButton);
      });

      // Then logout
      const logoutButton = screen.getByText('Logout');
      act(() => {
        fireEvent.click(logoutButton);
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });

    it('removes token and user data from localStorage', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // First login
      const loginButton = screen.getByText('Login');
      act(() => {
        fireEvent.click(loginButton);
      });

      // Then logout
      const logoutButton = screen.getByText('Logout');
      act(() => {
        fireEvent.click(logoutButton);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });

    it('calls localStorage.removeItem twice during logout', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // First login
      const loginButton = screen.getByText('Login');
      act(() => {
        fireEvent.click(loginButton);
      });

      // Then logout
      const logoutButton = screen.getByText('Logout');
      act(() => {
        fireEvent.click(logoutButton);
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Initialization from localStorage', () => {
    it('loads user data from localStorage on mount', () => {
      const mockUser = { id: '1', email: 'stored@example.com' };
      localStorageMock.getItem
        .mockReturnValueOnce('stored-token') // token
        .mockReturnValueOnce(JSON.stringify(mockUser)); // user

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as stored@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    it('handles invalid JSON in localStorage gracefully', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('stored-token') // token
        .mockReturnValueOnce('invalid-json'); // user

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      // Should clean up invalid data
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');

      consoleSpy.mockRestore();
    });

    it('does not load user data when token is missing', () => {
      localStorageMock.getItem
        .mockReturnValueOnce(null) // token
        .mockReturnValueOnce(JSON.stringify({ id: '1', email: 'stored@example.com' })); // user

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });

    it('does not load user data when user data is missing', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('stored-token') // token
        .mockReturnValueOnce(null); // user

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
  });

  describe('State Management', () => {
    it('maintains user state across re-renders', () => {
      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Login
      const loginButton = screen.getByText('Login');
      act(() => {
        fireEvent.click(loginButton);
      });

      // Re-render
      rerender(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as test@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    it('provides correct isAuthenticated value', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      // Login
      const loginButton = screen.getByText('Login');
      act(() => {
        fireEvent.click(loginButton);
      });

      // Now authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });

  describe('Error Handling', () => {
    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      
      // Should not crash
      expect(() => {
        act(() => {
          fireEvent.click(loginButton);
        });
      }).not.toThrow();
    });
  });
});
