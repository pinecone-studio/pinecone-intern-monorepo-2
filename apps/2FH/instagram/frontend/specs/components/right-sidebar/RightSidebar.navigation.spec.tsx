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

const mockRouter = {push: jest.fn(),replace: jest.fn(),prefetch: jest.fn(),back: jest.fn(),forward: jest.fn(),refresh: jest.fn(),};
const mockUser = {_id: 'user123',fullName: 'John Doe',userName: 'johndoe',email: 'john@example.com',profileImage: 'https://example.com/profile.jpg',bio: 'Test bio',isVerified: true,followers: [],followings: [],posts: [],stories: [],};
const mockSuggestedUsers = [
  {_id: 'suggested1', userName: 'suggesteduser1', fullName: 'Suggested User 1', profileImage: 'https://example.com/suggested1.jpg',isVerified: false,},
  {_id: 'suggested2',userName: 'suggesteduser2',fullName: 'Suggested User 2',profileImage: undefined,isVerified: true,},
  {_id: 'suggested3', userName: 'suggesteduser3', fullName: 'Suggested User 3', profileImage: 'https://example.com/suggested3.jpg',isVerified: false,},
  {_id: 'suggested4', userName: 'suggesteduser4', fullName: 'Suggested User 4', profileImage: undefined,isVerified: false,}
];

describe('RightSidebar - Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn(),});
  });

  it('should navigate to suggested user profile when username is clicked', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    (useQuery as jest.Mock).mockReturnValue({data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    
    const suggestedUser = screen.getByText('suggesteduser1');
    fireEvent.click(suggestedUser);
    
    expect(mockPush).toHaveBeenCalledWith('/suggesteduser1');
  });

  it('should navigate to suggested user profile when profile picture is clicked', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    
    (useQuery as jest.Mock).mockReturnValue({data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
        const profilePicture = screen.getByAltText('suggesteduser1');
    fireEvent.click(profilePicture);
    
    expect(mockPush).toHaveBeenCalledWith('/suggesteduser1');
  });
  it('should render FollowButton components for suggested users', () => {
    (useQuery as jest.Mock).mockReturnValue({data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByTestId('follow-btn-suggested1')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-suggested2')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-suggested3')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-suggested4')).toBeInTheDocument();
  });
});