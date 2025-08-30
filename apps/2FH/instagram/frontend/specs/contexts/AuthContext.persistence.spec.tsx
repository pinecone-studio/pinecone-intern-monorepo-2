import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

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
  const { user, token, isLoading, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.fullName : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="isLoading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
    </div>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext - Persistence & Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockPush.mockClear();
  });

  it('should load user data from localStorage on initialization', () => {
    const mockUser = {
      _id: 'stored-id',
      fullName: 'Stored User',
      userName: 'storeduser',
      email: 'stored@example.com'
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'user') return 'invalid-json';
      return null;
    });

    const originalError = console.error;
    console.error = jest.fn();

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');

    console.error = originalError;
  });

  it('should handle loading state properly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('isLoading')).toBeInTheDocument();
  });

  it('should transition from loading to not loading', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('isLoading')).toHaveTextContent('Not loading');
  });

  it('should handle missing token with valid user data', () => {
    const mockUser = {
      _id: 'stored-id',
      fullName: 'Stored User',
      userName: 'storeduser',
      email: 'stored@example.com'
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return null;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
  });

  it('should handle valid token with missing user data', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'user') return null;
      return null;
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
  });
});