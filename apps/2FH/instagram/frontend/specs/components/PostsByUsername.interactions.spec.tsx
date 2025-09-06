import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Posts Component - Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUserByUsernameQuery.mockReturnValue({
      data: { getUserByUsername: mockUserData },
      loading: false
    });
  });

  describe('Hover Interactions', () => {
    it('should show hover overlay with stats on mouse enter', () => {
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post 1').closest('div');
      expect(postContainer).toBeInTheDocument();
      const actualPostContainer = postContainer?.parentElement;
      const overlay = actualPostContainer?.querySelector('.absolute');
      expect(overlay).toBeInTheDocument();
      fireEvent.mouseEnter(postContainer!);
      expect(overlay).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });

    it('should display correct like and comment counts', () => {
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post 1').closest('div');
      fireEvent.mouseEnter(postContainer!);
      const likeCounts = screen.getAllByText('2');
      expect(likeCounts).toHaveLength(2);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to grid container', () => {
      render(<Posts userName="testuser" />);
      const gridContainer = screen.getAllByRole('img')[0].closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-1');
    });

    it('should apply correct CSS classes to post containers', () => {
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post 1').closest('div');
      const actualPostContainer = postContainer?.parentElement;
      expect(actualPostContainer).toHaveClass('aspect-square', 'relative', 'group', 'cursor-pointer', 'overflow-hidden');
    });

    it('should apply correct CSS classes to hover overlay', () => {
      render(<Posts userName="testuser" />);
      const postContainer = screen.getByAltText('Test post 1').closest('div');
      const actualPostContainer = postContainer?.parentElement;
      const overlay = actualPostContainer?.querySelector('.absolute');
      expect(overlay).toHaveClass('inset-0', 'bg-black/50', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-200', 'flex', 'items-center', 'justify-center');
    });
  });
});
