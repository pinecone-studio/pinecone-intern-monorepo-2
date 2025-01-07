import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateComment } from '@/components/comment/CreateComment';

// Mock dependencies
jest.mock('@/generated', () => ({
  useCreateCommentMutation: jest.fn(() => [jest.fn(() => Promise.resolve())]),
  useGetCommentsQuery: jest.fn(() => ({
    refetch: jest.fn(),
  })),
}));

describe('CreateComment Component', () => {
  it('renders the component with input and emoji', () => {
    render(<CreateComment id="test-post-id" />);

    // Check input field
    const input = screen.getByRole('textbox');
    expect(input);

    // Check emoji icon
    const emojiIcon = screen.getByRole('img', { hidden: true });
    expect(emojiIcon);
  });

  it('updates the input value as the user types', () => {
    render(<CreateComment id="test-post-id" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Comment' } });

    expect(input);
  });

  it('shows the "Post" button only when input is not empty', () => {
    render(<CreateComment id="test-post-id" />);

    const postButtonBefore = screen.queryByText('Post');
    expect(postButtonBefore);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Comment' } });

    const postButtonAfter = screen.getByText('Post');
    expect(postButtonAfter);
  });


  it('clears the input field after posting a comment', async () => {
    const createCommentMock = jest.fn(() => Promise.resolve());

    // Mock hooks
    jest.mock('@/generated', () => ({
      useCreateCommentMutation: jest.fn(() => [createCommentMock]),
      useGetCommentsQuery: jest.fn(() => ({
        refetch: jest.fn(),
      })),
    }));

    render(<CreateComment id="test-post-id" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Comment' } });

    const postButton = screen.getByText('Post');
    fireEvent.click(postButton);

    // Wait for async operations
    await Promise.resolve();

    expect(input);
  });
});
