import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetMyPostsDocument, GetUserDocument } from '@/generated';
import { PostCard } from '@/components/post/PostCard';

const myPostMock = [
  {
    request: {
      query: GetUserDocument,
    },
    result: {
      data: {
        getUser: {
          _id: '123',
          userName: 'test',
          profileImg: 'http://img1',
        },
      },
    },
  },

  {
    request: {
      query: GetMyPostsDocument,
      variables: {
        userId: '123',
      },
    },

    result: {
      data: {
        getMyPosts: [
          {
            _id: '1',
            user: '123',
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
  },
];

const myPostMockNoImg = [
  {
    request: {
      query: GetUserDocument,
    },
    result: {
      data: {
        getUser: {
          _id: '123',
          userName: 'test',
        },
      },
    },
  },

  {
    request: {
      query: GetMyPostsDocument,
      variables: {
        userId: '123',
      },
    },

    result: {
      data: {
        getMyPosts: [
          {
            _id: '1',
            user: '123',
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
  },
];

describe('getMyPost', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={myPostMock}>
        <PostCard />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('post-card')));
    const moreBtn = getByTestId('more-btn');
    fireEvent.keyDown(moreBtn, { key: 'Enter' });
    const deleteBtn = getByTestId('delete-btn');
    fireEvent.click(deleteBtn);
  });

  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={myPostMockNoImg}>
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
