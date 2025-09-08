import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ProfileStats, ProfileBio } from '@/components/userProfile/ProfileComponents';
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
describe('ProfileComponents - Advanced', () => {
  describe('ProfileStats', () => {
    it('renders profile stats with followers and followings', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileStats user={mockUser} currentUser={mockCurrentUser} postCount={10} />
        </MockedProvider>
      );
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
      expect(screen.getAllByText('2')).toHaveLength(2);
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('Followings')).toBeInTheDocument();
    });
    it('renders profile stats without current user', () => {
      render(
        <MockedProvider mocks={mocks}>
          <ProfileStats user={mockUser} currentUser={null} postCount={10} />
        </MockedProvider>
      );
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
      expect(screen.getAllByText('2')).toHaveLength(2);
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('Followings')).toBeInTheDocument();
    });
    it('renders with empty followers and followings', () => {
      const userWithNoFollowers = {
        ...mockUser,
        followers: [],
        followings: [],
      };
      render(
        <MockedProvider mocks={mocks}>
          <ProfileStats user={userWithNoFollowers} currentUser={mockCurrentUser} postCount={10} />
        </MockedProvider>
      );
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('posts')).toBeInTheDocument();
      expect(screen.getAllByText('0')).toHaveLength(2);
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('Followings')).toBeInTheDocument();
    });
  });
  describe('ProfileBio', () => {
    it('renders profile bio with full name and bio', () => {
      render(<ProfileBio user={mockUser} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('This is a test bio')).toBeInTheDocument();
    });
    it('renders profile bio without bio', () => {
      const userWithoutBio = { ...mockUser, bio: undefined };
      render(<ProfileBio user={userWithoutBio} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      const bioDiv = screen.getByText('Test User').parentElement?.querySelector('div:last-child');
      expect(bioDiv).toBeInTheDocument();
    });
    it('renders profile bio with empty bio string', () => {
      const userWithEmptyBio = { ...mockUser, bio: '' };
      render(<ProfileBio user={userWithEmptyBio} />);
      expect(screen.getByText('Test User')).toBeInTheDocument();
      const bioDiv = screen.getByText('Test User').parentElement?.querySelector('div:last-child');
      expect(bioDiv).toBeInTheDocument();
    });
  });
});
