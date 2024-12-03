import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { GetMyPostsDocument } from '@/generated';
import { PostCard } from '@/components/post/PostCard';

const myPostMock: MockedResponse = {
  request: {
    query: GetMyPostsDocument,
    variables: {
      userID: '673f6ec003387ea426252c1a',
    },
  },
  result: {
    data: {
      getMyPosts: [
        {
          _id: '1',
          user: '673f6ec003387ea426252c1a',
          description: "Test's des",
          images: ['http://img'],
          lastComments: 'String',
          commentCount: 1,
          likeCount: 2,
          updatedAt: '2024',
          createdAt: '2024',
        },
      ],
    },
  },
};

describe('getMyPost', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[myPostMock]}>
        <PostCard />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('post-card')));
    const moreBtn = getByTestId('more-btn');
    fireEvent.keyDown(moreBtn, { key: 'Enter' });
    const deleteBtn = getByTestId('delete-btn');
    fireEvent.click(deleteBtn);
  });
});
