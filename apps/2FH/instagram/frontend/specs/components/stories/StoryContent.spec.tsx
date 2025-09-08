import { render, screen } from '@testing-library/react';
import { StoryContent } from '@/components/stories/StoryContent';
import { demoImage } from '@/components/userProfile/mock-images';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

describe('StoryContent', () => {
  const mockStory = {
    _id: '1',
    image: '/story-image.jpg',
    author: {
      _id: 'author1',
      userName: 'testuser',
      profileImage: '/profile.jpg',
    },
  };

  it('renders story content with author information', () => {
    render(<StoryContent story={mockStory} />);
    
    const storyImage = screen.getByAltText('story');
    expect(storyImage).toHaveAttribute('src', '/story-image.jpg');
    
    const profileImage = screen.getByAltText('testuser');
    expect(profileImage).toHaveAttribute('src', '/profile.jpg');
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('uses fallback image when author profileImage is null', () => {
    const storyWithoutProfileImage = {
      ...mockStory,
      author: {
        ...mockStory.author,
        profileImage: null,
      },
    };

    render(<StoryContent story={storyWithoutProfileImage} />);
    
    const profileImage = screen.getByAltText('testuser');
    expect(profileImage).toHaveAttribute('src', demoImage);
  });

  it('uses fallback image when author profileImage is undefined', () => {
    const storyWithoutProfileImage = {
      ...mockStory,
      author: {
        ...mockStory.author,
        profileImage: undefined,
      },
    };

    render(<StoryContent story={storyWithoutProfileImage} />);
    
    const profileImage = screen.getByAltText('testuser');
    expect(profileImage).toHaveAttribute('src', demoImage);
  });

  it('uses fallback alt text when author userName is null', () => {
    const storyWithoutUserName = {
      ...mockStory,
      author: {
        ...mockStory.author,
        userName: null,
      },
    };

    render(<StoryContent story={storyWithoutUserName} />);
    
    const profileImage = screen.getByAltText('user');
    expect(profileImage).toBeInTheDocument();
  });

  it('uses fallback alt text when author userName is undefined', () => {
    const storyWithoutUserName = {
      ...mockStory,
      author: {
        ...mockStory.author,
        userName: undefined,
      },
    };

    render(<StoryContent story={storyWithoutUserName} />);
    
    const profileImage = screen.getByAltText('user');
    expect(profileImage).toBeInTheDocument();
  });

  it('handles author being null', () => {
    const storyWithoutAuthor = {
      ...mockStory,
      author: null,
    };

    render(<StoryContent story={storyWithoutAuthor} />);
    
    const profileImage = screen.getByAltText('user');
    expect(profileImage).toHaveAttribute('src', demoImage);
  });

  it('handles author being undefined', () => {
    const storyWithoutAuthor = {
      ...mockStory,
      author: undefined,
    };

    render(<StoryContent story={storyWithoutAuthor} />);
    
    const profileImage = screen.getByAltText('user');
    expect(profileImage).toHaveAttribute('src', demoImage);
  });
});
