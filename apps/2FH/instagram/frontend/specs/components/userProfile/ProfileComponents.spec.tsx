import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ProfileInfo, ProfileActions, ProfileStats, ProfileBio } from '@/components/userProfile/ProfileComponents';
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
        <MockedProvider>
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
        <MockedProvider>
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
        <MockedProvider>
          <ProfileActions user={mockUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument();
    });
    it('renders profile actions without follow button when same user', () => {
      render(
        <MockedProvider>
          <ProfileActions user={mockUser} currentUser={mockUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /follow/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /message/i })).not.toBeInTheDocument();
    });
    it('renders verified badge when user is verified', () => {
      render(
        <MockedProvider>
          <ProfileActions user={mockUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(document.querySelector('.text-blue-600')).toBeInTheDocument();
    });
    it('renders without verified badge when user is not verified', () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      render(
        <MockedProvider>
          <ProfileActions user={unverifiedUser} currentUser={mockCurrentUser} isFollowing={false} />
        </MockedProvider>
      );
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(document.querySelector('.text-blue-600')).not.toBeInTheDocument();
    });
  });
  describe('ProfileStats', () => {
    it('renders profile stats with followers and followings', () => {
      render(
        <MockedProvider>
          <ProfileStats user={mockUser} currentUser={mockCurrentUser} />
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
        <MockedProvider>
          <ProfileStats user={mockUser} currentUser={null} />
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
        <MockedProvider>
          <ProfileStats user={userWithNoFollowers} currentUser={mockCurrentUser} />
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
