import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetCommentsDocument } from '@/generated';
import { expect } from '@jest/globals';
import { CommentCard } from '@/components/comment/CommentCard';

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

describe('get comments', () => {
  it('should render comments', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={commentMock2}>
        <CommentCard id="post1" />
      </MockedProvider>
    );
    await waitFor(() => expect(getByTestId('getComments')));
  });
});
