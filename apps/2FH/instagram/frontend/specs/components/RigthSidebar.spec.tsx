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
describe('RightSidebar - Basic Rendering Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

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
    mockAuthenticatedUser();

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
    mockAuthenticatedUser();

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );

    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
  });

  it('renders loading state when suggestions are loading', () => {
    mockAuthenticatedUser();


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


    const loadingElements = screen.getAllByText((content, element) => {
      return element?.classList.contains('animate-pulse') || false;
    });
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders no suggestions message when no users found', () => {
    mockAuthenticatedUser();

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );


    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
  });

  it('renders user avatar when profile image is not available', () => {
    mockAuthenticatedUser({ profileImage: null });

    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );


    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of 'testuser'
  });

  it('renders user avatar when profile image is available', () => {
    mockAuthenticatedUser({ profileImage: 'profile.jpg' });
    render(
      <TestWrapper>
        <RightSidebar />
      </TestWrapper>
    );
    const profileImage = screen.getByAltText('testuser');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile.jpg');
  });
});