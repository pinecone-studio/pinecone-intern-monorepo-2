import '@testing-library/jest-dom';
import { Followings } from '@/components/userProfile/Followings';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

// Mock GraphQL query
const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($userName: String!) {
    getUserByUsername(userName: $userName) {
      _id
      userName
      profileImage
      fullName
      bio
      isVerified
      isPrivate
      email
      followers {
        _id
        userName
        profileImage
        fullName
        bio
        email
        __typename
      }
      followings {
        _id
        userName
        profileImage
        fullName
        bio
        email
        __typename
      }
      __typename
    }
  }
`;

// Mock responses for different usernames
const mocks = [
  {
    request: {
      query: GET_USER_BY_USERNAME,
      variables: { userName: 'currentUser' },
    },
    result: {
      data: {
        getUserByUsername: {
          _id: '123',
          userName: 'currentUser',
          profileImage: '/current-user.jpg',
          fullName: 'Current User',
          bio: 'Current user bio',
          isVerified: true,
          isPrivate: false,
          email: 'current@example.com',
          followers: [],
          followings: [],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: GET_USER_BY_USERNAME,
      variables: { userName: 'Bob' },
    },
    result: {
      data: {
        getUserByUsername: {
          _id: '2',
          userName: 'Bob',
          profileImage: '/bob.jpg',
          fullName: 'Bob User',
          bio: 'Bob bio',
          isVerified: false,
          isPrivate: false,
          email: 'bob@example.com',
          followers: [],
          followings: [],
          __typename: 'User',
        },
      },
    },
  },
];

// Mock FollowButton
jest.mock('../../../src/components/userProfile/FollowButton', () => ({
  FollowButton: ({ targetUserId }: { targetUserId: string }) => <button data-testid={`follow-btn-${targetUserId}`}>FollowButton</button>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'mocked-image'} />;
  },
}));

describe('Followings Component', () => {
  const currentUser = { _id: '123', userName: 'currentUser', followings: [] };

  it('renders followings count and opens dialog', () => {
    render(
      <MockedProvider mocks={mocks}>
        <Followings followings={[]} currentUser={currentUser} />
      </MockedProvider>
    );
    expect(screen.getByRole('button', { name: /0 Followings/i })).toBeInTheDocument();

    // Dialog trigger дархад open болохыг шалгана
    fireEvent.click(screen.getByRole('button', { name: /0 Followings/i }));
    expect(screen.getByText(/No followings yet/i)).toBeInTheDocument();
  });

  it('renders list of followings', () => {
    const followings = [
      { _id: '1', userName: 'Alice', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <Followings followings={followings} currentUser={currentUser} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders FollowButton only for current user', () => {
    const followings = [
      { _id: '123', userName: 'currentUser', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <Followings followings={followings} currentUser={currentUser} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    // FollowButton should NOT appear for the current user (same ID)
    expect(screen.queryByTestId('follow-btn-123')).not.toBeInTheDocument();
    // FollowButton should appear for other users (different ID)
    expect(screen.getByTestId('follow-btn-2')).toBeInTheDocument();
  });
});
