import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GetActiveStoriesDocument } from '@/generated';
import { HomePageStories } from '@/components/HomePageStories';
import { demoImage } from '@/components/userProfile/mock-images';

type MockLinkProps = { children: React.ReactNode; href: string };
type MockImageProps = { src: string; alt?: string };

// Mock next/link
jest.mock('next/link', () => {
  const MockLink: React.FC<MockLinkProps> = ({ children, href }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/image
jest.mock('next/image', () => {
  const MockImage: React.FC<MockImageProps> = ({ src, alt }) => <img src={src} alt={alt ?? ''} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockStories = [
  { _id: 's1', image: '/s1.png', createdAt: '', expiredAt: '', author: { _id: 'u1', userName: 'user1', profileImage: '/a1.png' }, viewers: [] },
  { _id: 's2', image: '/s2.png', createdAt: '', expiredAt: '', author: { _id: 'u2', userName: 'user2', profileImage: '/a2.png' }, viewers: [] },
];

const successMock = [{ request: { query: GetActiveStoriesDocument }, result: { data: { getActiveStories: mockStories } } }];
const emptyMock = [{ request: { query: GetActiveStoriesDocument }, result: { data: { getActiveStories: [] } } }];
const errorMock = [{ request: { query: GetActiveStoriesDocument }, error: new Error('GraphQL error') }];

describe('HomePageStories', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('Error: GraphQL error')).toBeInTheDocument());
  });

  it('renders no stories', async () => {
    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getByText('No stories available')).toBeInTheDocument());
  });

  it('renders unique users', async () => {
    render(
      <MockedProvider mocks={successMock} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });
  });

  it('deduplicates users in useMemo', async () => {
    const dupMock = [
      {
        request: { query: GetActiveStoriesDocument },
        result: {
          data: {
            getActiveStories: [
              { _id: 's1', image: '', createdAt: '', expiredAt: '', author: { _id: 'u1', userName: 'dupUser', profileImage: '/a1.png' }, viewers: [] },
              { _id: 's2', image: '', createdAt: '', expiredAt: '', author: { _id: 'u1', userName: 'dupUser', profileImage: '/a1.png' }, viewers: [] },
            ],
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={dupMock} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    await waitFor(() => expect(screen.getAllByText('dupUser')).toHaveLength(1));
  });

  it('uses demoImage when avatar is missing', async () => {
    const noAvatarMock = [
      {
        request: { query: GetActiveStoriesDocument },
        result: { data: { getActiveStories: [{ _id: 's1', image: '', createdAt: '', expiredAt: '', author: { _id: 'u1', userName: 'noavatar', profileImage: null }, viewers: [] }] } },
      },
    ];
    render(
      <MockedProvider mocks={noAvatarMock} addTypename={false}>
        <HomePageStories />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute('src', demoImage);
      expect(screen.getByText('noavatar')).toBeInTheDocument();
    });
  });
});
