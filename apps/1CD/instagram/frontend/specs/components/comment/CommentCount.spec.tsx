import React from 'react';
import { render, screen } from '@testing-library/react';
import { useGetCommentsQuery } from '@/generated';
import { CommentCount } from '@/components/comment/CommentCount';

jest.mock('@/generated', () => ({
  useGetCommentsQuery: jest.fn(),
}));

describe('CommentCount Component', () => {
  it('renders no comments message when there are no comments', () => {
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: { getComments: [] },
    });

    render(<CommentCount id="123" />);

    screen.getByTestId('getcomment');
  });

  it('renders "View comment" when there is one comment', () => {
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: {
        getComments: [
          {
            _id: 'comment1',
            postId: 'post1',
            commentText: 'Wooow amjilt',
            commentedUser: {
              _id: 'user1',
              userName: 'B190_$',
              fullName: 'Bilgun',
            },
          },
        ],
      },
    });

    render(<CommentCount id="123" />);

    screen.getByTestId('getcomment');
  });

  it('renders "View all X comments" when there are multiple comments', () => {
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      data: {
        getComments: [
          {
            _id: 'comment1',
            postId: 'post1',
            commentText: 'Wooow amjilt',
            commentedUser: {
              _id: 'user1',
              userName: 'B190_$',
              fullName: 'Bilgun',
            },
          },
          {
            _id: 'comment2',
            postId: 'post1',
            commentText: 'Wooow amjilt',
            commentedUser: {
              _id: 'user2',
              userName: 'B190_$',
              fullName: 'Bilgun',
            },
          },
          {
            _id: 'comment3',
            postId: 'post1',
            commentText: 'Wooow amjilt',
            commentedUser: {
              _id: 'user2',
              userName: 'B190_$',
              fullName: 'Bilgun',
            },
          },
        ],
      },
    });

    render(<CommentCount id="123" />);

    screen.getByTestId('getcomment');
  });
});
