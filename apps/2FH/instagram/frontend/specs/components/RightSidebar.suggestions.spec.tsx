import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { RightSidebar } from '@/components/RightSidebar';
import { AuthProvider } from '@/contexts/AuthContext';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/test',
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
const mockUseQuery = jest.fn();
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  gql: jest.fn(),
}));
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);
const mockAuthenticatedUser = (userOverrides = {}) => {
  const defaultUser = {
    _id: 'user-id',
    fullName: 'Test User',
    userName: 'testuser',
    email: 'test@example.com',
    profileImage: null,
    ...userOverrides,
  };
  localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'token') return 'mock-token';
    if (key === 'user') return JSON.stringify(defaultUser);
    return null;
  });
};
const mockSuggestedUsers = (users = []) => {
  mockUseQuery.mockReturnValue({
    data: {
      searchUsers: users
    },
    loading: false,
    error: null,
  });
};
describe('RightSidebar - Suggestions Feature Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null); 
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });
  it('renders suggested users when data is available', () => {
    mockAuthenticatedUser();
    const mockUsers = [
      {
        _id: 'user1',
        userName: 'suggested1',
        fullName: 'Suggested User 1',
        profileImage: null,
        isVerified: false
      },
      {
        _id: 'user2',
        userName: 'suggested2',
        fullName: 'Suggested User 2',
        profileImage: 'avatar.jpg',
        isVerified: true
      }
    ];
    mockSuggestedUsers(mockUsers);
    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );
    expect(screen.getByText('suggested1')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 1')).toBeInTheDocument();
    expect(screen.getByText('suggested2')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 2')).toBeInTheDocument();  
    const followButtons = screen.getAllByText('Follow');
    expect(followButtons.length).toBe(2);
  });
  it('renders suggested users with different profile states', () => {
    mockAuthenticatedUser();
    const mockUsers = [
      {
        _id: 'user1',
        userName: 'userWithoutImage',
        fullName: 'User Without Image',
        profileImage: null,
        isVerified: false
      },
      {
        _id: 'user2',
        userName: 'verifiedUser',
        fullName: 'Verified User',
        profileImage: 'verified-avatar.jpg',
        isVerified: true
      }
    ];
    mockSuggestedUsers(mockUsers);
    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );
    expect(screen.getByText('userWithoutImage')).toBeInTheDocument();
    expect(screen.getByText('User Without Image')).toBeInTheDocument();
    expect(screen.getByText('verifiedUser')).toBeInTheDocument();
    expect(screen.getByText('Verified User')).toBeInTheDocument();
  });
  it('handles empty suggestions list gracefully', () => {
    mockAuthenticatedUser();
    mockSuggestedUsers([]);
    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );
    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
  });
  it('renders multiple suggested users correctly', () => {
    mockAuthenticatedUser();
    const mockUsers = Array.from({ length: 5 }, (_, index) => ({
      _id: `user${index}`,
      userName: `user${index}`,
      fullName: `User ${index}`,
      profileImage: index % 2 === 0 ? null : `avatar${index}.jpg`,
      isVerified: index % 3 === 0
    }));
    mockSuggestedUsers(mockUsers);
    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );
    mockUsers.forEach(user => {
      expect(screen.getByText(user.userName)).toBeInTheDocument();
      expect(screen.getByText(user.fullName)).toBeInTheDocument();
    });
    const followButtons = screen.getAllByText('Follow');
    expect(followButtons.length).toBe(5);
  });
});