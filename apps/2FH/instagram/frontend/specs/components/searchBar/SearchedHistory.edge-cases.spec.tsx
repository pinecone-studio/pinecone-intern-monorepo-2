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

describe('SearchHistory - Edge Cases', () => {
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

  it('applies correct CSS classes to container', () => {
    const { container } = render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('space-y-1');
  });

  it('handles multiple user clicks', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const user1Element = screen.getByText('user1');
    const user2Element = screen.getByText('user2');

    fireEvent.click(user1Element);
    fireEvent.click(user2Element);

    expect(mockOnUserClick).toHaveBeenCalledTimes(2);
    expect(mockOnUserClick).toHaveBeenNthCalledWith(1, mockSearchHistory[0]);
    expect(mockOnUserClick).toHaveBeenNthCalledWith(2, mockSearchHistory[1]);
  });

  it('handles multiple remove icon clicks', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const removeIcon1 = screen.getByTestId('remove-icon-1');
    const removeIcon2 = screen.getByTestId('remove-icon-2');

    fireEvent.click(removeIcon1);
    fireEvent.click(removeIcon2);

    expect(mockOnRemoveUser).toHaveBeenCalledTimes(2);
    expect(mockOnRemoveUser).toHaveBeenNthCalledWith(1, '1');
    expect(mockOnRemoveUser).toHaveBeenNthCalledWith(2, '2');
  });

  it('renders user with all properties correctly', () => {
    const userWithAllProperties = {
      _id: '4',
      userName: 'user4',
      fullName: 'User Four',
      profileImage: 'https://example.com/avatar4.jpg',
      isVerified: true
    };

    render(
      <SearchHistory
        searchHistory={[userWithAllProperties]}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    expect(screen.getByText('user4')).toBeInTheDocument();
    expect(screen.getByText('User Four')).toBeInTheDocument();
  });

  it('handles empty search history array', () => {
    render(
      <SearchHistory
        searchHistory={[]}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    expect(screen.getByText('No recent searches')).toBeInTheDocument();
    expect(screen.queryByText(/user/)).not.toBeInTheDocument();
  });
});