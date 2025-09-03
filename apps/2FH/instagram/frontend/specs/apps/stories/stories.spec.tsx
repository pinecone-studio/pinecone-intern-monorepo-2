import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { GetActiveStoriesDocument } from '@/generated';
import Stories from '@/app/(sidebargui)/stories/page';

// ✅ next/router-ийг mock-лох
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Stories Component', () => {
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

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
              image: '/story1.png',
              createdAt: '2025-09-01T00:00:00Z',
              expiredAt: '2025-09-02T00:00:00Z',
              author: {
                _id: 'user1',
                userName: 'testuser',
                profileImage: '/avatar.png',
              },
              viewers: [],
            },
          ],
        },
      },
    },
  ];

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Stories />
      </MockedProvider>
    );
    expect(screen.getByText(/Loading stories.../i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const errorMocks = [
      {
        request: { query: GetActiveStoriesDocument },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Stories />
      </MockedProvider>
    );

    await waitFor(() => expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument());
  });

  it('renders story data correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Stories />
      </MockedProvider>
    );

    expect(await screen.findByText('Instagram')).toBeInTheDocument();
    expect(await screen.findByText('testuser')).toBeInTheDocument();
  });

  it('navigates to home when close button clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Stories />
      </MockedProvider>
    );

    const closeBtn = await screen.findByText('✕');
    fireEvent.click(closeBtn);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('tests specific uncovered functionality', async () => {
    // Create a mock that will allow us to test the uncovered lines
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Stories />
      </MockedProvider>
    );

    await waitFor(() => expect(screen.getByText('Instagram')).toBeInTheDocument());

    // Test that the component renders with stories
    expect(screen.getByTestId('stories-container')).toBeInTheDocument();

    // Test that the active user is visible (this tests getVisibleUsers function - line 119)
    // The component only shows one user story at a time, so we expect to see 'testuser'
    expect(screen.getByText('testuser')).toBeInTheDocument();

    // Test that the component has the expected structure
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByTestId('close-stories-btn')).toBeInTheDocument();

    // Test that the story image is displayed
    expect(screen.getByTestId('main-story-image')).toBeInTheDocument();

    // Test that navigation buttons are present
    expect(screen.getByTestId('prev-user-btn')).toBeInTheDocument();
    expect(screen.getByTestId('next-user-btn')).toBeInTheDocument();
  });
});
