import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
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
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext - Update User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockPush.mockClear();
  });

  it('should update user data when updateUser is called', () => {
    const TestComponentWithUpdate: React.FC = () => {
      const { user, updateUser, login } = useAuth();
      return (
        <div>
          <div data-testid="user">{user ? user.fullName : 'No user'}</div>
          <button
            data-testid="login-btn"
            onClick={() =>
              login(
                {
                  _id: 'test-id',
                  fullName: 'Test User',
                  userName: 'testuser',
                  email: 'test@example.com',
                },
                'test-token'
              )
            }
          >
            Login
          </button>
          <button
            data-testid="update-btn"
            onClick={() =>
              updateUser({
                _id: 'updated-id',
                fullName: 'Updated User',
                userName: 'updateduser',
                email: 'updated@example.com',
              })
            }
          >
            Update User
          </button>
        </div>
      );
    };

    render(
      <TestWrapper>
        <TestComponentWithUpdate />
      </TestWrapper>
    );
    
    const loginBtn = screen.getByTestId('login-btn');
    act(() => {
      loginBtn.click();
    });
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    
    const updateBtn = screen.getByTestId('update-btn');
    act(() => {
      updateBtn.click();
    });
    expect(screen.getByTestId('user')).toHaveTextContent('Updated User');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        _id: 'updated-id',
        fullName: 'Updated User',
        userName: 'updateduser',
        email: 'updated@example.com',
      })
    );
  });
});
