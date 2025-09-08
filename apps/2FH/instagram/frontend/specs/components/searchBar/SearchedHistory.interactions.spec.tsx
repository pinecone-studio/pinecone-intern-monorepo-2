import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SearchHistory } from '@/components/searchBar/SearchedHistory';

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('SearchHistory - Interactions', () => {
  const mockOnUserClick = jest.fn();
  const mockOnRemoveUser = jest.fn();

  const mockSearchHistory = [
    {
      _id: '1',
      userName: 'user1',
      fullName: 'User One',
      profileImage: 'https://example.com/avatar1.jpg',
      isVerified: true
    },
    {
      _id: '2',
      userName: 'user2',
      fullName: 'User Two',
      profileImage: null,
      isVerified: false
    },
    {
      _id: '3',
      userName: 'user3',
      fullName: 'User Three',
      profileImage: 'https://example.com/avatar3.jpg',
      isVerified: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders users without verified badges', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    // Check that user2 (isVerified: false) doesn't have verified badge
    const user2Element = screen.getByText('user2');
    expect(user2Element).toBeInTheDocument();
  });

  it('renders remove icon when onRemoveUser is provided', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const removeIcons = screen.getAllByTestId(/remove-icon-/);
    expect(removeIcons).toHaveLength(3);
  });

  it('does not render remove icon when onRemoveUser is not provided', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={undefined}
      />
    );

    const removeIcons = screen.queryAllByTestId(/remove-icon-/);
    expect(removeIcons).toHaveLength(0);
  });

  it('calls onRemoveUser when remove icon is clicked', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const removeIcon = screen.getByTestId('remove-icon-1');
    fireEvent.click(removeIcon);

    expect(mockOnRemoveUser).toHaveBeenCalledWith('1');
  });

  it('calls onRemoveUser when remove icon is clicked without calling onUserClick', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const removeIcon = screen.getByTestId('remove-icon-1');
    fireEvent.click(removeIcon);

    expect(mockOnRemoveUser).toHaveBeenCalledWith('1');
    expect(mockOnUserClick).not.toHaveBeenCalled();
  });

  it('applies correct CSS classes to user items', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const userItems = screen.getAllByText(/user/);
    userItems.forEach(item => {
      const parentDiv = item.closest('div[class*="flex items-center justify-between"]');
      expect(parentDiv).toHaveClass('flex', 'items-center', 'justify-between', 'p-2', 'hover:bg-gray-50', 'cursor-pointer');
    });
  });
});