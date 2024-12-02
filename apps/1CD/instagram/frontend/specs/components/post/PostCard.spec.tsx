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

    await waitFor(() => expect(getByTestId('post-load')));

    // const posrCard = getByTestId('post-card');

    // await waitFor(() => expect(posrCard));

    const moreBtn = getByTestId('more-btn');
    fireEvent.click(moreBtn);

    await waitFor(() => expect(getByTestId('more')));

    const deleteBtn = getByTestId('delete-btn');
    // // const deleteModal = getByTestId('delete-modal');

    fireEvent.click(deleteBtn);
    // // await waitFor(() => expect(deleteModal));
  });
});
