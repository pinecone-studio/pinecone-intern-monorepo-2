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

describe('Followings Component - Advanced scenarios', () => {
  const currentUser = { _id: '123', userName: 'currentUser', followings: [] };

  it('renders FollowButton for other users when current user is following them', () => {
    const followings = [
      { _id: '1', userName: 'Alice', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];
    const currentUserWithFollowings = {
      ...currentUser,
      followings: [{ _id: '1' }], // Following Alice
    };

    render(
      <MockedProvider mocks={mocks}>
        <Followings followings={followings} currentUser={currentUserWithFollowings} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    // FollowButton should appear for Alice (user1) since currentUser is following her
    expect(screen.getByTestId('follow-btn-1')).toBeInTheDocument();
    // FollowButton should appear for Bob (user2) since currentUser is not following him
    expect(screen.getByTestId('follow-btn-2')).toBeInTheDocument();
  });

  it('renders FollowButton for other users when current user has no followings', () => {
    const followings = [
      { _id: '1', userName: 'Alice', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];
    const currentUserWithoutFollowings = {
      ...currentUser,
      followings: [], // Not following anyone
    };

    render(
      <MockedProvider mocks={mocks}>
        <Followings followings={followings} currentUser={currentUserWithoutFollowings} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    // FollowButton should appear for both Alice and Bob
    expect(screen.getByTestId('follow-btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-2')).toBeInTheDocument();
  });
});
