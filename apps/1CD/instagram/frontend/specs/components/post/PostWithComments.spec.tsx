import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetCommentsDocument } from '@/generated';
import { PostWithComments } from '@/app/(main)/_components/PostWithComments';
import { expect } from '@jest/globals';

const commentMock2 = [
  {
    request: {
      query: GetCommentsDocument,
      variables: {
        postId: 'post1',
      },
    },

    result: {
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
        ],
      },
    },
  },
];

const commentMock1 = [
  {
    request: {
      query: GetCommentsDocument,
      variables: {
        postId: 'post1',
      },
    },

    result: {
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
    },
  },
];
const commentMock0 = [
  {
    request: {
      query: GetCommentsDocument,
      variables: {
        postId: 'post1',
      },
    },

    result: {
      data: {
        getComments: [null],
      },
    },
  },
];

describe('get Post with comments', () => {
  it('should render with two comments', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={commentMock2}>
        <PostWithComments id="post1" />
      </MockedProvider>
    );
    const openCommentBtn = getByTestId('open-comment-btn');
    await waitFor(() => expect(getByTestId('open-comment-btn')));
    fireEvent.keyDown(openCommentBtn, { key: 'Enter' });

    await waitFor(() => expect(getByText('View all 2 comments')));
    fireEvent.keyDown(openCommentBtn, { key: 'Enter' });
  });

  it('should render without comment #2', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={commentMock0}>
        <PostWithComments id="post1" />
      </MockedProvider>
    );
    const openCommentBtn = getByTestId('open-comment-btn');
    fireEvent.keyDown(openCommentBtn, { key: 'Enter' });
    await waitFor(() => expect(openCommentBtn));
  });
  it('should render with one comment', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={commentMock1}>
        <PostWithComments id="post1" />
      </MockedProvider>
    );
    const openCommentBtn = getByTestId('open-comment-btn');
    await waitFor(() => expect(getByTestId('open-comment-btn')));

    await waitFor(() => expect(getByText('View comment')));
    fireEvent.keyDown(openCommentBtn, { key: 'Enter' });
  });
});
