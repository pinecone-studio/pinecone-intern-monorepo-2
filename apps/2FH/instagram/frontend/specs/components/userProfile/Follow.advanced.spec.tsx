import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Followers } from '@/components/userProfile/Followers';
import { gql } from '@apollo/client';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));
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
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>;
const mockCurrentUser = { _id: 'user1', userName: 'currentUser' };
describe('Followers component - Advanced scenarios', () => {
  it('renders FollowButton for other users when current user is following them', () => {
    const followers = [
      { _id: 'user2', userName: 'Alice', profileImage: null },
      { _id: 'user3', userName: 'Bob', profileImage: null },
    ];
    const currentUserWithFollowings = {
      ...mockCurrentUser,
      followings: [{ _id: 'user2' }], // Following Alice
    };
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Followers followers={followers} currentUser={currentUserWithFollowings} />
        </MockedProvider>
      </TestWrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followers/i }));
    expect(screen.getByTestId('follow-btn-user2')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-user3')).toBeInTheDocument();
  });

  it('renders FollowButton for other users when current user followings is undefined', () => {
    const followers = [
      { _id: 'user2', userName: 'Alice', profileImage: null },
      { _id: 'user3', userName: 'Bob', profileImage: null },
    ];
    const currentUserWithoutFollowings = {
      _id: 'user1',
      userName: 'currentUser',
    };
    render(
      <TestWrapper>
        <MockedProvider mocks={mocks}>
          <Followers followers={followers} currentUser={currentUserWithoutFollowings} />
        </MockedProvider>
      </TestWrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followers/i }));
    expect(screen.getByTestId('follow-btn-user2')).toBeInTheDocument();
    expect(screen.getByTestId('follow-btn-user3')).toBeInTheDocument();
  });
});
