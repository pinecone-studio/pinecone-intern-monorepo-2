import React from 'react';
import { render, screen } from '@testing-library/react';
import TinderInterface from '../components/swipe/TinderInterface';

// Mock all the child components
jest.mock('../components/swipe/HeaderSwipe', () => ({
  HeaderSwipe: () => <div data-testid="header-swipe">Header</div>,
}));

jest.mock('../components/swipe/ActionButtons', () => ({
  ActionButtons: ({ onDislike, onLike, onSuperLike }: any) => (
    <div data-testid="action-buttons">
      <button onClick={onDislike}>Dislike</button>
      <button onClick={onLike}>Like</button>
      <button onClick={onSuperLike}>Super Like</button>
    </div>
  ),
}));

jest.mock('../components/swipe/MatchModal', () => ({
  MatchModal: ({ profile, onKeepSwiping, onMessage }: any) => (
    <div data-testid="match-modal">
      <span>{profile.name}</span>
      <button onClick={onKeepSwiping}>Keep Swiping</button>
      <button onClick={onMessage}>Message</button>
    </div>
  ),
}));

jest.mock('../components/swipe/LoadingState', () => ({
  LoadingState: () => <div data-testid="loading-state">Loading...</div>,
}));

jest.mock('../components/swipe/ErrorState', () => ({
  ErrorState: ({ refetch }: any) => (
    <div data-testid="error-state">
      <button onClick={refetch}>Retry</button>
    </div>
  ),
}));

jest.mock('../components/swipe/NoMoreProfiles', () => ({
  NoMoreProfiles: ({ setCurrentIndex }: any) => (
    <div data-testid="no-more-profiles">
      <button onClick={() => setCurrentIndex(0)}>Start Over</button>
    </div>
  ),
}));

jest.mock('../components/swipe/ProfileCards', () => ({
  ProfileCards: ({ visibleProfiles }: any) => (
    <div data-testid="profile-cards">
      {visibleProfiles.map((profile: any, index: number) => (
        <div key={profile.id} data-testid={`profile-card-${index}`}>
          {profile.name}
        </div>
      ))}
    </div>
  ),
}));

// Mock the useTinderSwipe hook
jest.mock('../components/swipe/useTinderSwipe', () => ({
  useTinderSwipe: jest.fn(),
}));

const mockUseTinderSwipe = require('../components/swipe/useTinderSwipe').useTinderSwipe;

describe('TinderInterface', () => {
  const mockCurrentUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders loading state when loading', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: true,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    it('renders loading state when user loading', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: true,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error state when there is an error', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: 'Some error',
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('renders error state when there is a user error', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: 'User error',
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  describe('No More Profiles State', () => {
    it('renders no more profiles state when currentIndex is negative', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: -1,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('no-more-profiles')).toBeInTheDocument();
    });
  });

  describe('Main Content', () => {
    it('renders main content when everything is loaded and profiles exist', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [{ id: '1', name: 'Sarah' }],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
        matchedProfile: null,
        animatingCards: new Set(),
        visibleProfiles: [{ id: '1', name: 'Sarah' }],
        handleDislike: jest.fn(),
        handleLike: jest.fn(),
        handleSuperLike: jest.fn(),
        handleKeepSwiping: jest.fn(),
        handleMessage: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('header-swipe')).toBeInTheDocument();
      expect(screen.getByTestId('profile-cards')).toBeInTheDocument();
      expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
    });

    it('renders match modal when there is a matched profile', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [{ id: '1', name: 'Sarah' }],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
        matchedProfile: { id: '1', name: 'Sarah' },
        animatingCards: new Set(),
        visibleProfiles: [{ id: '1', name: 'Sarah' }],
        handleDislike: jest.fn(),
        handleLike: jest.fn(),
        handleSuperLike: jest.fn(),
        handleKeepSwiping: jest.fn(),
        handleMessage: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('match-modal')).toBeInTheDocument();
      expect(screen.getByText('Sarah')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to child components', () => {
      const mockHandleDislike = jest.fn();
      const mockHandleLike = jest.fn();
      const mockHandleSuperLike = jest.fn();
      const mockHandleKeepSwiping = jest.fn();
      const mockHandleMessage = jest.fn();

      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [{ id: '1', name: 'Sarah' }],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
        matchedProfile: null,
        animatingCards: new Set(),
        visibleProfiles: [{ id: '1', name: 'Sarah' }],
        handleDislike: mockHandleDislike,
        handleLike: mockHandleLike,
        handleSuperLike: mockHandleSuperLike,
        handleKeepSwiping: mockHandleKeepSwiping,
        handleMessage: mockHandleMessage,
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('profile-cards')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      expect(() => render(<TinderInterface currentUserId={mockCurrentUserId} />)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty profiles array', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.getByTestId('profile-cards')).toBeInTheDocument();
    });

    it('handles null matched profile', () => {
      mockUseTinderSwipe.mockReturnValue({
        loading: false,
        userLoading: false,
        error: null,
        userError: null,
        refetch: jest.fn(),
        profiles: [{ id: '1', name: 'Sarah' }],
        currentIndex: 0,
        setCurrentIndex: jest.fn(),
        matchedProfile: null,
        animatingCards: new Set(),
        visibleProfiles: [{ id: '1', name: 'Sarah' }],
        handleDislike: jest.fn(),
        handleLike: jest.fn(),
        handleSuperLike: jest.fn(),
        handleKeepSwiping: jest.fn(),
        handleMessage: jest.fn(),
      });

      render(<TinderInterface currentUserId={mockCurrentUserId} />);
      
      expect(screen.queryByTestId('match-modal')).not.toBeInTheDocument();
    });
  });
});
