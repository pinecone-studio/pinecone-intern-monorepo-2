/* eslint-disable max-lines */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { RightSidebar } from '@/components/RightSidebar';
import { AuthProvider } from '@/contexts/AuthContext';


// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/test',
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Apollo Client with queries
const mockUseQuery = jest.fn();
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  gql: jest.fn(),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('RightSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Default mock for useQuery
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('renders nothing when user is not authenticated', () => {
    const { container } = render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders user info section when authenticated', () => {
    // Mock authenticated user
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
        <RightSidebar />
      </TestWrapper>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('renders suggestions section when authenticated', () => {
    // Mock authenticated user
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
        <RightSidebar />
      </TestWrapper>
    );

    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
  });

  it('renders loading state when suggestions are loading', () => {
    // Mock authenticated user
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

    // Mock loading state
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    // Should show loading skeletons
    const loadingElements = screen.getAllByText((content, element) => {
      return element?.classList.contains('animate-pulse') || false;
    });
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders suggested users when data is available', () => {
    // Mock authenticated user
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

    // Mock suggested users data
    mockUseQuery.mockReturnValue({
      data: {
        searchUsers: [
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
        ]
      },
      loading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    expect(screen.getByText('suggested1')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 1')).toBeInTheDocument();
    expect(screen.getByText('suggested2')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 2')).toBeInTheDocument();
    
    // Should show Follow buttons
    const followButtons = screen.getAllByText('Follow');
    expect(followButtons.length).toBe(2);
  });

  it('renders no suggestions message when no users found', () => {
    // Mock authenticated user
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
        <RightSidebar />
      </TestWrapper>
    );

    // Since our mock useQuery returns no data, it should show no suggestions
    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
  });

  it('renders user avatar when profile image is not available', () => {
    // Mock authenticated user without profile image
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({
        _id: 'user-id',
        fullName: 'Test User',
        userName: 'testuser',
        email: 'test@example.com',
        profileImage: null
      });
      return null;
    });

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    // Should show first letter of username as avatar
    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of 'testuser'
  });

  it('renders user avatar when profile image is available', () => {
    // Mock authenticated user with profile image
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'user') return JSON.stringify({
        _id: 'user-id',
        fullName: 'Test User',
        userName: 'testuser',
        email: 'test@example.com',
        profileImage: 'profile.jpg'
      });
      return null;
    });

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    // Should show profile image
    const profileImage = screen.getByAltText('testuser');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile.jpg');
  });
});
