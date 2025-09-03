import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ProfileInfo, ProfileActions } from '@/components/userProfile/ProfileComponents';
import { gql } from '@apollo/client';
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
const mockCurrentUser = {
  _id: 'currentUser123',
  userName: 'currentuser',
};
describe('ProfileComponents', () => {
  describe('ProfileInfo', () => {
    it('renders profile info with all components', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileInfo user={mockUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('This is a test bio')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
      expect(screen.getAllByText('2')).toHaveLength(2);
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('Followings')).toBeInTheDocument();
    });
    it('renders without current user', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileInfo user={mockUser} currentUser={null} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
  describe('ProfileActions', () => {
    it('renders profile actions with follow button when not current user', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileActions user={mockUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument();
    });
    it('renders profile actions without follow button when same user', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileActions user={mockUser} currentUser={mockUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /follow/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /message/i })).not.toBeInTheDocument();
    });
    it('renders verified badge when user is verified', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileActions user={mockUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(document.querySelector('.text-blue-600')).toBeInTheDocument();
    });
    it('renders without verified badge when user is not verified', () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      render(
        <MockedProvider mocks={mocks}>
          <ProfileActions user={unverifiedUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(document.querySelector('.text-blue-600')).not.toBeInTheDocument();
    });
  });
});
