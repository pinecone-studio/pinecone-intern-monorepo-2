import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StoryViewer from '../../../src/components/stories/StoryViewer';
import { demoImage, storyImage } from '@/components/userProfile/mock-images';

const mockUser = {
  id: 'u1',
  username: 'testuser',
  avatar: '/test-avatar.png',
  stories: [
    { id: 's1', src: '/story1.png', duration: 5000 },
    { id: 's2', src: '/story2.png', duration: 5000 },
  ],
};
describe('StoryViewer component', () => {
  const baseProps = {
    user: mockUser,
    story: mockUser.stories[0],
    currentStory: 0,
    progress: 0,
    onPrevStory: jest.fn(),
    onNextStory: jest.fn(),
    onPrevUser: jest.fn(),
    onNextUser: jest.fn(),
    canGoPrev: true,
    isActive: true,
    onUserSelect: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Active Mode', () => {
    it('renders active mode correctly', () => {
      render(<StoryViewer {...baseProps} />);
      expect(screen.getByTestId('main-story-image')).toHaveAttribute('src', mockUser.stories[0].src);
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2); // ◀ ▶
    });
    it('calls onPrevStory when left-click zone is clicked', () => {
      render(<StoryViewer {...baseProps} />);
      fireEvent.click(screen.getByTestId('left-click-zone'));
      expect(baseProps.onPrevStory).toHaveBeenCalled();
    });
    it('calls onNextStory when right-click zone is clicked', () => {
      render(<StoryViewer {...baseProps} />);
      fireEvent.click(screen.getByTestId('right-click-zone'));
      expect(baseProps.onNextStory).toHaveBeenCalled();
    });
    it('calls onPrevUser when ◀ button is clicked', () => {
      render(<StoryViewer {...baseProps} />);
      fireEvent.click(screen.getByText('◀'));
      expect(baseProps.onPrevUser).toHaveBeenCalled();
    });
    it('calls onNextUser when ▶ button is clicked', () => {
      render(<StoryViewer {...baseProps} />);
      fireEvent.click(screen.getByText('▶'));
      expect(baseProps.onNextUser).toHaveBeenCalled();
    });
    it('disables prev user button when canGoPrev is false', () => {
      render(<StoryViewer {...baseProps} canGoPrev={false} />);
      const prevButton = screen.getByTestId('prev-user-btn');
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass('disabled:opacity-30');
    });
    it('renders progress bars correctly for multiple stories', () => {
      render(<StoryViewer {...baseProps} currentStory={1} progress={50} />);
      const progressBars = screen.getAllByRole('generic').filter((el) => el.className.includes('h-1 bg-white'));
      expect(progressBars[0]).toHaveStyle('width: 100%');
      expect(progressBars[1]).toHaveStyle('width: 50%');
    });
    it('handles story image error with fallback', () => {
      render(<StoryViewer {...baseProps} />);
      const img = screen.getByTestId('main-story-image') as HTMLImageElement;
      fireEvent.error(img);
      expect(img.src).toContain(storyImage);
    });
    it('handles avatar image error with fallback', () => {
      render(<StoryViewer {...baseProps} />);
      const avatarImg = screen.getByAltText(mockUser.username) as HTMLImageElement;
      fireEvent.error(avatarImg);
      expect(avatarImg.src).toContain(demoImage);
    });
    it('renders with undefined story', () => {
      render(<StoryViewer {...baseProps} story={undefined} />);
      const img = screen.getByTestId('main-story-image');
      expect(img).not.toHaveAttribute('src');
    });
  });
  describe('Preview Mode', () => {
    const previewProps = { ...baseProps, isActive: false };
    it('renders preview mode correctly', () => {
      render(<StoryViewer {...previewProps} />);
      expect(screen.getByTestId('preview-container')).toBeInTheDocument();
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      expect(screen.getByAltText('story')).toHaveAttribute('src', mockUser.stories[0].src);
    });
    it('calls onUserSelect when preview is clicked', () => {
      render(<StoryViewer {...previewProps} />);
      fireEvent.click(screen.getByTestId('preview-container'));
      expect(baseProps.onUserSelect).toHaveBeenCalled();
    });
    it('handles story image error with fallback in preview mode', () => {
      render(<StoryViewer {...previewProps} />);
      const img = screen.getByAltText('story') as HTMLImageElement;
      fireEvent.error(img);
      expect(img.src).toContain(storyImage);
    });
    it('handles avatar image error with fallback in preview mode', () => {
      render(<StoryViewer {...previewProps} />);
      const avatarImg = screen.getByAltText(mockUser.username) as HTMLImageElement;
      fireEvent.error(avatarImg);
      expect(avatarImg.src).toContain(demoImage);
    });
    it('renders without onUserSelect prop', () => {
      const { onUserSelect, ...propsWithoutCallback } = previewProps;
      render(<StoryViewer {...propsWithoutCallback} />);
      expect(screen.getByTestId('preview-container')).toBeInTheDocument();
    });
    it('truncates long usernames in preview mode', () => {
      const userWithLongName = {
        ...mockUser,
        username: 'verylongusernamethatshouldbetrunicated',
      };
      render(<StoryViewer {...previewProps} user={userWithLongName} />);
      const usernameElement = screen.getByText(userWithLongName.username);
      expect(usernameElement).toHaveClass('truncate');
    });
  });
  describe('Edge Cases', () => {
    it('renders when user has no stories', () => {
      const userWithNoStories = { ...mockUser, stories: [] };
      render(<StoryViewer {...baseProps} user={userWithNoStories} story={undefined} />);
      expect(screen.getByTestId('main-story-image')).toBeInTheDocument();
    });
    it('renders progress correctly when on last story', () => {
      const lastStoryIndex = mockUser.stories.length - 1;
      render(<StoryViewer {...baseProps} currentStory={lastStoryIndex} progress={75} />);
      const progressBars = screen.getAllByRole('generic').filter((el) => el.className.includes('h-1 bg-white'));
      progressBars.slice(0, lastStoryIndex).forEach((bar) => {
        expect(bar).toHaveStyle('width: 100%');
      });
      expect(progressBars[lastStoryIndex]).toHaveStyle('width: 75%');
    });
    it('renders progress correctly when progress is 0%', () => {
      render(<StoryViewer {...baseProps} currentStory={0} progress={0} />);
      const progressBars = screen.getAllByRole('generic').filter((el) => el.className.includes('h-1 bg-white'));
      expect(progressBars[0]).toHaveStyle('width: 0%');
    });
    it('renders progress correctly when progress is 100%', () => {
      render(<StoryViewer {...baseProps} currentStory={0} progress={100} />);
      const progressBars = screen.getAllByRole('generic').filter((el) => el.className.includes('h-1 bg-white'));
      expect(progressBars[0]).toHaveStyle('width: 100%');
    });
  });
});
