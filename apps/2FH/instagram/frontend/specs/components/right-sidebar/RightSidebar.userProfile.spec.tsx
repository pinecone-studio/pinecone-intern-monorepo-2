import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('RightSidebar - User Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
  });

  it('should render user profile with profile image', () => {
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('johndoe')).toBeInTheDocument();
    expect(screen.getByAltText('johndoe')).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });

  it('should render user profile without profile image (fallback to initial)', () => {
    const userWithoutImage = { ...mockUser, profileImage: undefined };
    mockUseAuth.mockReturnValue({user: userWithoutImage,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: mockLogout,isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    const logoutButton = screen.getByText('Log out');
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should navigate to user profile when user profile is clicked', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn()});
    (useQuery as jest.Mock).mockReturnValue(mockQuery);
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    
    const userProfile = screen.getByText('johndoe');
    fireEvent.click(userProfile);
    
    expect(mockPush).toHaveBeenCalledWith('/userProfile');
  });
});