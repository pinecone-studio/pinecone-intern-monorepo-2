import { render, screen } from '@testing-library/react';
import UserProfile from './page';
import '@testing-library/jest-dom';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockUser = {
  _id: 'user123',
  userName: 'travel.explorer',
  fullName: 'Travel Explorer',
  bio: '📸 Travel Photographer',
  email: 'travel@example.com',
  profileImage: '/profile.jpg',
  isVerified: true,
  followers: [{ _id: 'f1', userName: 'follower1' }],
  followings: [{ _id: 'f2', userName: 'following1' }],
  posts: ['post1', 'post2'],
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('UserProfile', () => {
  beforeEach(() => {
    // Mock localStorage to return user data
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'mock-token';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders username and bio', () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    expect(screen.getByText('travel.explorer')).toBeInTheDocument();
    expect(screen.getByText('📸 Travel Photographer')).toBeInTheDocument();
  });

  it('renders posts count, followers, following', () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1 Followers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /1 Followings/i })).toBeInTheDocument();
  });

  it('renders posts grid with images', () => {
    render(
      <TestWrapper>
        <UserProfile />
      </TestWrapper>
    );
    const posts = screen.getAllByRole('img');
    // Should have at least the profile image
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveAttribute('alt', 'travel.explorer profile picture');
  });
});
