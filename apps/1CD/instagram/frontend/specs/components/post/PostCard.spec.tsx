import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetMyFollowingsPostsDocument } from '@/generated';
import { PostCard } from '@/components/post/PostCard';

const myPostMock = [
  {
    request: {
      query: GetMyFollowingsPostsDocument,
    },

    result: {
      data: {
        getMyFollowingsPosts: [
          {
            _id: '1',
            user: {
              _id: 'user1',
              userName: 'User',
              profileImg: 'http://img',
            },
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
const myPostInmagesMock = [
  {
    request: {
      query: GetMyFollowingsPostsDocument,
    },

    result: {
      data: {
        getMyFollowingsPosts: [
          {
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
        ],
      },
    },
  },
];

const myPostMockNoImg = [
  {
    request: {
      query: GetMyFollowingsPostsDocument,
    },

    result: {
      data: {
        getMyFollowingsPosts: [
          {
            _id: '1',
            user: {
              _id: 'user1',
              userName: 'User',
            },
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

const myPostMockNull = [
  {
    request: {
      query: GetMyFollowingsPostsDocument,
    },

    result: {
      data: {
        getMyFollowingsPosts: [],
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
  it('should render images', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={myPostInmagesMock}>
        <PostCard />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('post-card')));
    await waitFor(() => expect(getByTestId('moreImgBtnSection')));

    const moreBtn = getByTestId('more-btn');
    fireEvent.keyDown(moreBtn, { key: 'Enter' });
    const deleteBtn = getByTestId('delete-btn');
    fireEvent.click(deleteBtn);
  });

  it('should render no img', async () => {
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
  it('should render no data', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={myPostMockNull}>
        <PostCard />
      </MockedProvider>
    );
    await waitFor(() => expect(getByTestId('post-card')));
  });
});
