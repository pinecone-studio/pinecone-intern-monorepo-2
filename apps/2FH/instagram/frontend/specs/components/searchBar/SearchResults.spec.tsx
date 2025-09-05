import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SearchResults } from '@/components/searchBar/SearchResults';

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('SearchResults', () => {
  const mockOnUserClick = jest.fn();

  const mockUsers = [
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

  it('renders loading state', () => {
    render(
      <SearchResults results={[]} loading={true} onUserClick={mockOnUserClick}/>
    );
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
  it('renders no results message when results array is empty', () => {
    render(
      <SearchResults results={[]} loading={false} onUserClick={mockOnUserClick}/>
    );
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Try searching for something else')).toBeInTheDocument();
  });
  it('renders search results with correct heading', () => {
    render(
      <SearchResults results={mockUsers} loading={false} onUserClick={mockOnUserClick}/>
    );
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });
  it('renders all users in results', () => {
    render(
      <SearchResults results={mockUsers} loading={false} onUserClick={mockOnUserClick} />
    );
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
    expect(screen.getByText('User Three')).toBeInTheDocument();
  });
  it('calls onUserClick when user is clicked', () => {
    render(
      <SearchResults
        results={mockUsers}
        loading={false}
        onUserClick={mockOnUserClick}
      />
    );
    const userElement = screen.getByText('user1').closest('div');
    expect(userElement).toBeInTheDocument();
    fireEvent.click(userElement as HTMLElement);
    expect(mockOnUserClick).toHaveBeenCalledTimes(1);
    expect(mockOnUserClick).toHaveBeenCalledWith(mockUsers[0]);
  });
  it('renders profile images when available', () => {
    render(
      <SearchResults results={mockUsers} loading={false} onUserClick={mockOnUserClick} />
    );
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); 
  });
  it('renders default avatar when profile image is null', () => {
    render(
      <SearchResults results={[mockUsers[1]]} loading={false} onUserClick={mockOnUserClick} />
    );
    const defaultAvatar = screen.getByAltText('User Two');
    expect(defaultAvatar).toHaveAttribute('src', '/default-avatar.png');
  });
  it('renders users without verified badges', () => {
    render(
      <SearchResults results={mockUsers} loading={false} onUserClick={mockOnUserClick} />
    );
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
  });
  it('applies correct CSS classes to user items', () => {
    render(
      <SearchResults results={[mockUsers[0]]} loading={false}  onUserClick={mockOnUserClick}/>
    );
    const userItem = screen.getByText('user1').closest('div[class*="flex items-center p-2"]');
    expect(userItem).toHaveClass('flex', 'items-center', 'p-2', 'hover:bg-gray-50', 'rounded-lg', 'cursor-pointer');
  });
  it('handles multiple user clicks', () => {
    render(
      <SearchResults results={mockUsers} loading={false} onUserClick={mockOnUserClick} />
    );
    const user1Element = screen.getByText('user1').closest('div');
    const user2Element = screen.getByText('user2').closest('div');
    expect(user1Element).toBeInTheDocument();
    expect(user2Element).toBeInTheDocument();
    fireEvent.click(user1Element as HTMLElement);
    fireEvent.click(user2Element as HTMLElement);
    expect(mockOnUserClick).toHaveBeenCalledTimes(2);
    expect(mockOnUserClick).toHaveBeenNthCalledWith(1, mockUsers[0]);
    expect(mockOnUserClick).toHaveBeenNthCalledWith(2, mockUsers[1]);
  });
  it('renders user with all properties correctly', () => {
    const userWithAllProps = {
      _id: '4',
      userName: 'testuser',
      fullName: 'Test User',
      profileImage: 'https://example.com/test.jpg',
      isVerified: true
    };
    render(
      <SearchResults results={[userWithAllProps]} loading={false} onUserClick={mockOnUserClick}
      />
    );
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toBeInTheDocument();
  });
  it('handles empty results array after loading', () => {
    const { rerender } = render(
      <SearchResults results={[]} loading={true} onUserClick={mockOnUserClick} />
    );
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    rerender(
      <SearchResults results={[]} loading={false} onUserClick={mockOnUserClick}/>
    );
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });
});
