import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from '../components/swipe/ProfileCard';
import { mockProfiles } from '../components/swipe/MockData';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the ProfileInfo component
jest.mock('../components/swipe/ProfileInfo', () => ({
  ProfileInfo: ({ profile }: any) => (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.profession}</p>
      <p>{profile.bio}</p>
      {profile.interests.slice(0, 3).map((interest: string, idx: number) => (
        <span key={idx}>{interest}</span>
      ))}
    </div>
  ),
}));

// Mock the SwipeOverlay component
jest.mock('../components/swipe/SwipeOverlay', () => ({
  SwipeOverlay: () => <div data-testid="swipe-overlay">Swipe Overlay</div>,
}));

// Mock the useProfileCardDragLogic hook
jest.mock('../components/swipe/ProfileCardDragLogic', () => ({
  useProfileCardDragLogic: () => ({
    dragOffset: { x: 0, y: 0 },
    isAnimatingOut: false,
    handleDragStart: jest.fn(),
    handleDrag: jest.fn(),
    handleDragEnd: jest.fn(),
    getCardTransform: () => ({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }),
    getTransition: () => ({ duration: 0.3 }),
  }),
}));

describe('ProfileCard', () => {
  const mockProfile = mockProfiles[0];
  const defaultProps = {
    profile: mockProfile,
    index: 0,
    _onSwipe: jest.fn(),
    _isDragging: false,
    setIsDragging: jest.fn(),
    isExiting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile information correctly', () => {
    render(<ProfileCard {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Loves hiking and coding')).toBeInTheDocument();
  });

  it('renders profile image with correct alt text', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProfile.images[0]);
  });

  it('renders interests as tags', () => {
    render(<ProfileCard {...defaultProps} />);
    
    expect(screen.getByText('hiking')).toBeInTheDocument();
    expect(screen.getByText('coding')).toBeInTheDocument();
    expect(screen.getByText('music')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const card = screen.getByText('John Doe').closest('div');
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'overflow-hidden');
  });

  it('handles different index positions correctly', () => {
    const { rerender } = render(<ProfileCard {...defaultProps} />);
    
    // First card (index 0) should be draggable
    expect(screen.getByText('John Doe').closest('div')).toHaveAttribute('draggable', 'true');
    
    // Second card (index 1) should not be draggable
    rerender(<ProfileCard {...defaultProps} index={1} />);
    expect(screen.getByText('John Doe').closest('div')).toHaveAttribute('draggable', 'false');
  });

  it('applies correct z-index based on card index', () => {
    const { rerender } = render(<ProfileCard {...defaultProps} />);
    
    // First card should have highest z-index
    let card = screen.getByText('John Doe').closest('div');
    expect(card).toHaveStyle({ zIndex: '10' });
    
    // Second card should have lower z-index
    rerender(<ProfileCard {...defaultProps} index={1} />);
    card = screen.getByText('John Doe').closest('div');
    expect(card).toHaveStyle({ zIndex: '9' });
  });

  it('handles isExiting prop correctly', () => {
    render(<ProfileCard {...defaultProps} isExiting={true} />);
    
    const card = screen.getByText('John Doe').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('limits interests display to first 3 even when more exist', () => {
    const profileWithManyInterests = {
      ...mockProfile,
      interests: ['hiking', 'coding', 'music', 'travel', 'reading', 'art']
    };
    
    render(<ProfileCard {...defaultProps} profile={profileWithManyInterests} />);
    
    expect(screen.getByText('hiking')).toBeInTheDocument();
    expect(screen.getByText('coding')).toBeInTheDocument();
    expect(screen.getByText('music')).toBeInTheDocument();
    expect(screen.queryByText('travel')).not.toBeInTheDocument();
    expect(screen.queryByText('reading')).not.toBeInTheDocument();
    expect(screen.queryByText('art')).not.toBeInTheDocument();
  });

  it('applies gradient overlay to profile image', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const overlay = screen.getByText('John Doe').closest('div')?.querySelector('.bg-gradient-to-t');
    expect(overlay).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    expect(() => render(<ProfileCard {...defaultProps} />)).not.toThrow();
  });

  it('maintains consistent layout structure', () => {
    const { container } = render(<ProfileCard {...defaultProps} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    const imageContainer = mainContainer?.firstChild as HTMLElement;
    
    expect(mainContainer).toHaveClass('absolute', 'w-[600px]', 'bg-white', 'rounded-xl', 'overflow-hidden');
    expect(imageContainer).toHaveClass('relative', 'h-full', 'overflow-hidden');
  });
});
