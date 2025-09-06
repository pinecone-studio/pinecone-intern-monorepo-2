import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Posts } from '@/components/userProfile/Post';

const mockUseGetUserByUsernameQuery = jest.fn();
jest.mock('@/generated', () => ({
  get useGetUserByUsernameQuery() {
    return mockUseGetUserByUsernameQuery;
  },
}));

jest.mock('next/image', () => {
  const MockImage = ({ blurDataURL, ...props }: any) => {
    return <img {...props} alt={props.alt || ''} />;
  };
  return MockImage;
});

jest.mock('@/components/userProfile/format-number', () => ({
  formatNumber: (num: number) => {
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  },
}));

const mockUserData = {
  _id: 'user1',
  userName: 'testuser',
  profileImage: 'profile.jpg',
  fullName: 'Test User',
  bio: 'Test bio',
  isVerified: false,
  isPrivate: false,
  email: 'test@example.com',
  followers: [],
  followings: [],
  posts: [
    {
      _id: 'post1',
      image: 'post1.jpg',
      caption: 'Test post 1',
      likes: [{ _id: 'like1' }, { _id: 'like2' }],
      comments: [{ _id: 'comment1' }, { _id: 'comment2' }]
    },
    {
      _id: 'post2',
      image: 'post2.jpg',
      caption: 'Test post 2',
      likes: [{ _id: 'like3' }],
      comments: [{ _id: 'comment3' }]
    }
  ]
};

describe('Posts Component - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Edge Cases', () => {
    it('should handle posts with empty array image', () => {
      const userDataWithEmptyArrayImage = {
        ...mockUserData,
        posts: [{
          _id: 'post1',
          image: [],
          caption: 'Test post',
          likes: [],
          comments: []
        }]
      };
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: userDataWithEmptyArrayImage },
        loading: false
      });
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post').closest('div');
      expect(postContainer).toBeInTheDocument();
    });

    it('should handle posts with null image', () => {
      const userDataWithNullImage = {
        ...mockUserData,
        posts: [{
          _id: 'post1',
          image: null,
          caption: 'Test post',
          likes: [],
          comments: []
        }]
      };
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: userDataWithNullImage },
        loading: false
      });
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post').closest('div');
      expect(postContainer).toBeInTheDocument();
    });
  });
});
