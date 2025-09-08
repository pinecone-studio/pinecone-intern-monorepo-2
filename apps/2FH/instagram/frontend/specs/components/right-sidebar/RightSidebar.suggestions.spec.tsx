import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { RightSidebar } from '@/components/RightSidebar';
import { useAuth } from '@/contexts/AuthContext';
jest.mock('next/navigation', () => ({useRouter: jest.fn(),}));
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
describe('RightSidebar - Suggestions and Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useMutation as jest.Mock).mockReturnValue([jest.fn(), { loading: false }]);
    mockUseAuth.mockReturnValue({user: mockUser,token: 'token123',isLoading: false,login: jest.fn(),logout: jest.fn(),isAuthenticated: true,updateUser: jest.fn(),});
  });
  it('should render suggested users with profile images', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('suggesteduser1')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 1')).toBeInTheDocument();
    expect(screen.getByAltText('suggesteduser1')).toBeInTheDocument();
    expect(screen.getByAltText('suggesteduser1')).toHaveAttribute('src', 'https://example.com/suggested1.jpg');
    expect(screen.getByText('suggesteduser2')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 2')).toBeInTheDocument();
    expect(screen.getByText('suggesteduser3')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 3')).toBeInTheDocument();
    expect(screen.getByText('suggesteduser4')).toBeInTheDocument();
    expect(screen.getByText('Suggested User 4')).toBeInTheDocument();
  });
  it('should render suggested users without profile images (fallback to initial)', () => {
    const usersWithoutImages = mockSuggestedUsers.map(user => ({ ...user, profileImage: undefined }));
    (useQuery as jest.Mock).mockReturnValue({data: {getNotFollowingUsers: usersWithoutImages,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    const initials = screen.getAllByText('S');
    expect(initials).toHaveLength(4);
  });
  it('should display follow buttons for all suggested users', () => {
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
  it('should handle follow button clicks', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    const followButtons = screen.getAllByText('Follow');
    fireEvent.click(followButtons[0]);
    expect(followButtons[0]).toBeInTheDocument();
  });
  it('should display empty state when no suggestions available', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {getNotFollowingUsers: [],},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });
  it('should display empty state when data is undefined', () => {
    (useQuery as jest.Mock).mockReturnValue({data: undefined,loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });
  it('should display empty state when getNotFollowingUsers is undefined', () => {
    (useQuery as jest.Mock).mockReturnValue({data: {getNotFollowingUsers: undefined,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });
  it('should render loading skeleton when loading is true', () => {
    (useQuery as jest.Mock).mockReturnValue({data: undefined,loading: true,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements).toHaveLength(3);
  });
  it('should call useQuery with correct variables', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    expect(useQuery).toHaveBeenCalledWith(
      expect.any(Object),
      {variables: { userId: 'user123' }}
    );
  });
  it('should handle see all button click', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {getNotFollowingUsers: mockSuggestedUsers,},loading: false,error: undefined,});
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RightSidebar />
      </MockedProvider>
    );
    const seeAllButton = screen.getByText('See All');
    fireEvent.click(seeAllButton);
    expect(seeAllButton).toBeInTheDocument();
  });
});