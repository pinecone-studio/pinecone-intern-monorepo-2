import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ProfileInfo } from '@/components/userProfile/ProfileComponents';
import { gql } from '@apollo/client';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));
const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($userName: String!) {
    getUserByUsername(userName: $userName) {
      _id
      userName
      profileImage
      fullName
      bio
      isVerified
      isPrivate
      email
      followers {
        _id
        userName
        profileImage
        fullName
        bio
        email
        __typename
      }
      followings {
        _id
        userName
        profileImage
        fullName
        bio
        email
        __typename
      }
      __typename
    }
  }
`;
const mocks = [
  {
    request: {
      query: GET_USER_BY_USERNAME,
      variables: { userName: 'testuser' },
    },
    result: {
      data: {
        getUserByUsername: {
          _id: 'user123',
          userName: 'testuser',
          profileImage: '/test-image.jpg',
          fullName: 'Test User',
          bio: 'This is a test bio',
          isVerified: true,
          isPrivate: false,
          email: 'test@example.com',
          followers: [
            { _id: 'follower1', userName: 'follower1', profileImage: '/follower1.jpg', fullName: 'Follower 1', bio: 'Bio 1', email: 'f1@example.com', __typename: 'User' },
            { _id: 'follower2', userName: 'follower2', profileImage: null, fullName: 'Follower 2', bio: 'Bio 2', email: 'f2@example.com', __typename: 'User' },
          ],
          followings: [
            { _id: 'following1', userName: 'following1', profileImage: '/following1.jpg', fullName: 'Following 1', bio: 'Bio 1', email: 'f1@example.com', __typename: 'User' },
            { _id: 'following2', userName: 'following2', profileImage: null, fullName: 'Following 2', bio: 'Bio 2', email: 'f2@example.com', __typename: 'User' },
          ],
          __typename: 'User',
        },
      },
    },
  },
];
const mockUser = {
  _id: 'user123',
  userName: 'testuser',
  fullName: 'Test User',
  bio: 'This is a test bio',
  profileImage: '/test-image.jpg',
  isPrivate: false,
  isVerified: true,
  posts: [{ _id: 'post1' }],
  followers: [
    { _id: 'follower1', userName: 'follower1', profileImage: '/follower1.jpg' },
    { _id: 'follower2', userName: 'follower2', profileImage: null },
  ],
  followings: [
    { _id: 'following1', userName: 'following1', profileImage: '/following1.jpg' },
    { _id: 'following2', userName: 'following2', profileImage: null },
  ],
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('ProfileComponents - Stats', () => {
  describe('ProfileStats', () => {
    it('renders profile stats with current user having followings', () => {
      const currentUserWithFollowings = {
        _id: 'currentUser123',
        userName: 'currentuser',
        followings: [
          { _id: 'following1', userName: 'following1' },
          { _id: 'following2', userName: 'following2' },
        ],
      };
      render(
        <TestWrapper>
          <MockedProvider mocks={mocks}>
            <ProfileInfo user={mockUser} currentUser={currentUserWithFollowings} isFollowing={false} postCount={10} />
          </MockedProvider>
        </TestWrapper>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
    });
  });
});
