import { fireEvent, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetPostByPostIdDocument } from '@/generated';
import { PostWithComments } from '@/components/post/PostWithComments';

const myPostMock = [
  {
    request: {
      query: GetPostByPostIdDocument,
    },
    result: {
      data: {
        getPostByPostId: {
          _id: '1',
          user: {
            _id: 'user1',
            userName: 'User',
            profileImg: 'http://img',
          },
          description: "Test's des",
          images: ['http://img', 'http://img'],
          lastComments: 'String',
          commentCount: 1,
          likeCount: 2,
          updatedAt: '2024',
          createdAt: '2024',
        },
      },
    },
  },
];

describe('getMyPost', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={myPostMock}>
        <PostWithComments id="post1" />
      </MockedProvider>
    );
    const moreBtn = getByTestId('open-comment-btn');
    fireEvent.keyDown(moreBtn, { key: 'Enter' });
  });
});
