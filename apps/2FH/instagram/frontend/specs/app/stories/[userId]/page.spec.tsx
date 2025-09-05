import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import UserStories from '@/app/(sidebargui)/stories/[userId]/page';
import { GetActiveStoriesDocument } from '@/generated';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: GetActiveStoriesDocument,
    },
    result: {
      data: {
        getActiveStories: [
          {
            _id: 'story1',
            image: '/story1.jpg',
            createdAt: '2025-01-01',
            expiredAt: '2025-12-31',
            author: { _id: '1', userName: 'Alice', profileImage: '/alice.jpg' },
            viewers: [],
          },
          {
            _id: 'story2',
            image: '/story2.jpg',
            createdAt: '2025-01-01',
            expiredAt: '2025-12-31',
            author: { _id: '2', userName: 'Bob', profileImage: '/bob.jpg' },
            viewers: [],
          },
        ],
      },
    },
  },
];

describe('UserStories Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ userId: '1' });
  });

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <UserStories />
      </MockedProvider>
    );
    expect(screen.getByTestId('loading-stories')).toBeInTheDocument();
  });

  it('renders stories correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserStories />
      </MockedProvider>
    );

    // Wait for the stories to load
    await waitFor(() => screen.getByTestId('story-viewer-1'));

    expect(screen.getByTestId('story-viewer-1')).toBeInTheDocument();
    expect(screen.getByTestId('story-viewer-2')).toBeInTheDocument();
  });

  it('navigates to next user when clicking next-user button', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserStories />
      </MockedProvider>
    );

    await waitFor(() => screen.getByTestId('story-viewer-1'));

    const nextBtn = screen.getByTestId('next-user-btn');
    fireEvent.click(nextBtn);

    // Current user should now be Bob
    expect(screen.getByTestId('story-viewer-2')).toBeInTheDocument();
  });

  it('navigates back to previous user when clicking prev-user button', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserStories />
      </MockedProvider>
    );

    await waitFor(() => screen.getByTestId('story-viewer-1'));

    // Go to next user first
    fireEvent.click(screen.getByTestId('next-user-btn'));

    const prevBtn = screen.getByTestId('prev-user-btn');
    fireEvent.click(prevBtn);

    // Should navigate back to Alice
    expect(screen.getByTestId('story-viewer-1')).toBeInTheDocument();
  });

  it('closes stories when clicking close button', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserStories />
      </MockedProvider>
    );

    await waitFor(() => screen.getByTestId('close-stories-btn'));
    fireEvent.click(screen.getAllByTestId('close-stories-btn')[0]);
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
