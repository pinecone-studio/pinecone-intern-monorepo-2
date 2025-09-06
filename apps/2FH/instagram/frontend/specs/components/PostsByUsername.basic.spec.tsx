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

describe('Posts Component - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: null,
        loading: true
      });
      render(<Posts userName="testuser" />);
      const skeletonContainers = screen.getAllByText('', { selector: '.animate-pulse' });
      expect(skeletonContainers).toHaveLength(6);
    });
  });

  describe('No Posts State', () => {
    it('should render no posts message when user has no posts', () => {
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: { ...mockUserData, posts: [] } },
        loading: false
      });
      render(<Posts userName="testuser" />);
      const cameraIcon = document.querySelector('.lucide-camera');
      expect(cameraIcon).toHaveClass('size-20', 'border', 'rounded-full', 'border-[#000000]', 'p-3');
    });
  });

  describe('Posts Rendering', () => {
    beforeEach(() => {
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: mockUserData },
        loading: false
      });
    });

    it('should render posts with single image correctly', () => {
      render(<Posts userName="testuser" />);
      const postImages = screen.getAllByRole('img');
      expect(postImages).toHaveLength(2);
      expect(postImages[0]).toHaveAttribute('src', 'post1.jpg');
      expect(postImages[0]).toHaveAttribute('alt', 'Test post 1');
    });

    it('should render posts with array images correctly', () => {
      const userDataWithArrayImages = {
        ...mockUserData,
        posts: [{
          _id: 'post1',
          image: ['image1.jpg', 'image2.jpg'],
          caption: 'Post with multiple images',
          likes: [],
          comments: []
        }]
      };
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: userDataWithArrayImages },
        loading: false
      });
      render(<Posts userName="testuser" />);
      const postImage = screen.getByRole('img');
      expect(postImage).toHaveAttribute('src', 'image1.jpg');
      expect(postImage).toHaveAttribute('alt', 'Post with multiple images');
    });

    it('should handle posts without caption', () => {
      const userDataWithoutCaption = {
        ...mockUserData,
        posts: [{
          _id: 'post1',
          image: 'post1.jpg',
          caption: null,
          likes: [],
          comments: []
        }]
      };
      mockUseGetUserByUsernameQuery.mockReturnValue({
        data: { getUserByUsername: userDataWithoutCaption },
        loading: false
      });
      render(<Posts userName="testuser" />);
      const postImage = screen.getByRole('img');
      expect(postImage).toHaveAttribute('alt', 'Post by testuser');
    });

    it('should handle posts with empty caption', () => {
      const userDataWithEmptyCaption = { ...mockUserData, posts: [{ _id: 'post1', image: 'post1.jpg', caption: '', likes: [], comments: [] }] };
      mockUseGetUserByUsernameQuery.mockReturnValue({ data: { getUserByUsername: userDataWithEmptyCaption }, loading: false });
      render(<Posts userName="testuser" />);
      const postImage = screen.getByRole('img');
      expect(postImage).toHaveAttribute('alt', 'Post by testuser');
    });
  });

});
