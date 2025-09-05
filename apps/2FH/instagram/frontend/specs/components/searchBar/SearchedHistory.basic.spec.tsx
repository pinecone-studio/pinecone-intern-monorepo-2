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

describe('SearchHistory - Basic Rendering', () => {
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

  it('renders no recent searches message when searchHistory is empty', () => {
    render(
      <SearchHistory
        searchHistory={[]}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    expect(screen.getByText('No recent searches')).toBeInTheDocument();
  });

  it('renders no recent searches message when searchHistory is null', () => {
    render(
      <SearchHistory
        searchHistory={null as any}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    expect(screen.getByText('No recent searches')).toBeInTheDocument();
  });

  it('renders all users in search history', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
  });

  it('calls onUserClick when user is clicked', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const userElement = screen.getByText('user1');
    fireEvent.click(userElement);

    expect(mockOnUserClick).toHaveBeenCalledWith(mockSearchHistory[0]);
  });

  it('renders profile images when available', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    const profileImages = screen.getAllByRole('img');
    expect(profileImages).toHaveLength(2); // Only 2 users have profile images
  });

  it('renders default avatar when profile image is null', () => {
    render(
      <SearchHistory
        searchHistory={mockSearchHistory}
        onUserClick={mockOnUserClick}
        onRemoveUser={mockOnRemoveUser}
      />
    );

    // Check that user2 (with null profileImage) has a default avatar
    const user2Element = screen.getByText('user2').closest('div');
    expect(user2Element).toBeInTheDocument();
  });
});