import { render, screen } from '@testing-library/react';
import { useGetPostByPostIdQuery, useGetUserPostsQuery } from '@/generated';
import PostsSection from '@/components/visit-profile/PostsSection';

jest.mock('@/generated', () => ({
  useGetUserPostsQuery: jest.fn(),
  useGetPostByPostIdQuery: jest.fn(),
}));

describe('post section', () => {
  const mockPostsData = {
    getUserPosts: [null],
  };
  const mockPostData = {
    getPostByPostId: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render post section', async () => {
    (useGetUserPostsQuery as jest.Mock).mockReturnValue({
      data: mockPostsData,
    });
    (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
      data: mockPostData,
    });

    render(<PostsSection id="user1" />);

    screen.getByTestId('userPosts');
    screen.getAllByTestId('userPost');
  });
});
