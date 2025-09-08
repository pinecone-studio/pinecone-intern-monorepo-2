import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { RightSidebar } from '@/components/RightSidebar';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock('@/components/userProfile/FollowButton', () => ({
  FollowButton: ({ targetUserId }: { targetUserId: string; userName: string }) => (
    <button data-testid={`follow-btn-${targetUserId}`}>
      Follow
    </button>
  ),
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};
const mockUser = {
  _id: 'user123',
  fullName: 'John Doe',
  userName: 'johndoe',
  email: 'john@example.com',
  profileImage: 'https://example.com/profile.jpg',
  bio: 'Test bio',
  isVerified: true,
  followers: [],
  followings: [],
  posts: [],
  stories: [],
};
const mockSuggestedUsers = [
  {_id: 'suggested1', userName: 'suggesteduser1', fullName: 'Suggested User 1', profileImage: 'https://example.com/suggested1.jpg',isVerified: false,},
  {_id: 'suggested2',userName: 'suggesteduser2',fullName: 'Suggested User 2',profileImage: undefined,isVerified: true,}
];
const mockQuery = {
  data: {
    getNotFollowingUsers: mockSuggestedUsers,
  },loading: false, error: undefined,
};

describe('RightSidebar - Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
  });

  it('should not render when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({user: null, token: null,isLoading: false, login: jest.fn(), logout: jest.fn(),isAuthenticated: false,updateUser: jest.fn(),
    });
    (useQuery as jest.Mock).mockReturnValue({ data: undefined, loading: false, error: undefined });
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should not render when user is null but isAuthenticated is true', () => {
    mockUseAuth.mockReturnValue({ user: null,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn(),
    });
    (useQuery as jest.Mock).mockReturnValue({ data: undefined, loading: false, error: undefined });
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when user is authenticated', () => {
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
  });

  it('should render loading state for suggestions', () => {
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue({loading: true, error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements).toHaveLength(3);
  });

  it('should display suggestions header and see all button', () => {
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
  });
});