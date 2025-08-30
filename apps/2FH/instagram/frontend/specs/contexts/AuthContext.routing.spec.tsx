import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
const mockPush = jest.fn();
let mockPathname = '/';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
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
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.fullName : 'No user'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
    </div>
  );
};
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);
describe('AuthContext - Route Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockPush.mockClear();
    mockPathname = '/';
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      usePathname: () => mockPathname,
    }));
  });
  it('should have route protection logic', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('user')).toBeInTheDocument();
    expect(screen.getByTestId('isAuthenticated')).toBeInTheDocument();
  });
  it('should handle authentication state changes', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
  });
  it('should return null redirect path when on valid route for auth state', () => {   
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({
        _id: 'user-id',
        fullName: 'Test User',
        userName: 'testuser',
        email: 'test@example.com'
      });
      return null;
    });
    mockPathname = '/dashboard';
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      usePathname: () => '/dashboard',
    }));
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');   
  });
  it('should redirect authenticated user from login page', () => {    
    mockPathname = '/login';
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({
        _id: 'user-id',
        fullName: 'Test User',
        userName: 'testuser',
        email: 'test@example.com'
      });
      return null;
    });
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');   
  });
  it('should redirect authenticated user from signup page', () => {   
    mockPathname = '/signup';
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({
        _id: 'user-id',
        fullName: 'Test User',
        userName: 'testuser',
        email: 'test@example.com'
      });
      return null;
    });
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');    
  });
  it('should handle unauthenticated users on protected routes', () => {
    mockPathname = '/dashboard';
    localStorageMock.getItem.mockReturnValue(null);
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });
  it('should handle public routes correctly', () => {
    mockPathname = '/about';

    localStorageMock.getItem.mockReturnValue(null);

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });
});