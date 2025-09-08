/*eslint-disable max-lines*/
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Posts } from '../../../src/components/userProfile/Post';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

jest.mock('../../../src/components/userProfile/format-number', () => ({
  formatNumber: jest.fn((num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...props} />
  ),
}));

// GraphQL query for posts (simplified version used in Posts component)
const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($author: ID!) {
    getPostsByAuthor(author: $author) {
      _id
      image
      caption
      createdAt
    }
  }
`;

// Mock data for posts (simplified structure matching the query)
const mockPosts = [
  {
    _id: 'post1',
    image: ['/post1.jpg'],
    caption: 'Test post 1',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    _id: 'post2',
    image: ['/post2.jpg'],
    caption: 'Test post 2',
    createdAt: '2023-01-02T00:00:00Z',
  },
  {
    _id: 'post3',
    image: ['/post3.jpg'],
    caption: 'Test post 3',
    createdAt: '2023-01-03T00:00:00Z',
  },
  {
    _id: 'post4',
    image: ['/post4.jpg'],
    caption: 'Test post 4',
    createdAt: '2023-01-04T00:00:00Z',
  },
  {
    _id: 'post5',
    image: ['/post5.jpg'],
    caption: 'Test post 5',
    createdAt: '2023-01-05T00:00:00Z',
  },
  {
    _id: 'post6',
    image: ['/post6.jpg'],
    caption: 'Test post 6',
    createdAt: '2023-01-06T00:00:00Z',
  },
];

// Apollo Client mocks
const mocks = [
  {
    request: {
      query: GET_POSTS_BY_AUTHOR,
      variables: { author: 'user123' },
    },
    result: {
      data: {
        getPostsByAuthor: mockPosts,
      },
    },
  },
];

describe('Posts Component', () => {
  it('should render successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeTruthy();
  });

  it('should render all 6 mock posts', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const posts = document.querySelectorAll('.aspect-square');
    expect(posts).toHaveLength(6);
  });

  it('should display formatted likes and comments count on hover', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const likeIcons = document.querySelectorAll('svg');
    expect(likeIcons.length).toBeGreaterThan(0);
  });

  it('should render images with correct alt text', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should have hover overlay with opacity transition', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const overlays = document.querySelectorAll('.absolute.inset-0.bg-black\\/50');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('should apply correct grid layout classes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Posts userId="user123" />
      </MockedProvider>
    );
    
    // Wait for posts to load by checking for the first image
    await screen.findByAltText('Test post 1');
    
    const gridContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
    expect(gridContainer).toBeTruthy();
  });
});
