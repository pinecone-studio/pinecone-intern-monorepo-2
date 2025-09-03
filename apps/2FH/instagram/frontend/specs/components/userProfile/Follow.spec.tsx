import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Followers } from '@/components/userProfile/Followers';
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
          _id: 'user1',
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
      variables: { userName: 'Alice' },
    },
    result: {
      data: {
        getUserByUsername: {
          _id: 'user2',
          userName: 'Alice',
          profileImage: '/alice.jpg',
          fullName: 'Alice User',
          bio: 'Alice bio',
          isVerified: false,
          isPrivate: false,
          email: 'alice@example.com',
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
          _id: 'user3',
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
const mockCurrentUser = { _id: 'user1', userName: 'currentUser' };
describe('Followers component', () => {
  it('renders followers count correctly', () => {
    render(
      <MockedProvider mocks={mocks}>
        <Followers followers={[]} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    expect(screen.getByRole('button', { name: /0 Followers/i })).toBeInTheDocument();
  });
  it('shows "No followers yet" when followers list is empty', () => {
    render(
      <MockedProvider mocks={mocks}>
        <Followers followers={[]} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /0 Followers/i }));
    expect(screen.getByText(/No followers yet/i)).toBeInTheDocument();
  });
  it('renders follower list when followers exist', () => {
    const followers = [
      { _id: 'user2', userName: 'Alice', profileImage: null },
      { _id: 'user3', userName: 'Bob', profileImage: null },
    ];
    render(
      <MockedProvider mocks={mocks}>
        <Followers followers={followers} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followers/i }));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
  it('renders FollowButton for the current user follower', () => {
    const followers = [{ _id: 'user1', userName: 'currentUser', profileImage: null }];
    render(
      <MockedProvider mocks={mocks}>
        <Followers followers={followers} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /1 Followers/i }));
    expect(screen.queryByTestId('follow-btn-user1')).not.toBeInTheDocument();
  });
});
