import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetCommentsDocument } from '@/generated';
import { expect } from '@jest/globals';
import { LastCommentCard } from '@/components/comment/LastCommentCard';

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

describe('get last comments', () => {
  it('should render last comments', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={commentMock2}>
        <LastCommentCard id="post1" />
      </MockedProvider>
    );
    await waitFor(() => expect(getByTestId('lastComments')));
  });
});
