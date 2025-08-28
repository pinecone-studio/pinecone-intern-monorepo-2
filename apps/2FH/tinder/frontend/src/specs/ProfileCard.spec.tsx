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

describe('ProfileCard', () => {
  const mockProfile = mockProfiles[0];
  const defaultProps = {
    profile: mockProfile,
    index: 0,
    onSwipe: jest.fn(),
    isDragging: false,
    setIsDragging: jest.fn(),
    isExiting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile information correctly', () => {
    render(<ProfileCard {...defaultProps} />);
    
    expect(screen.getByText('Sarah')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Marketing Manager')).toBeInTheDocument();
    expect(screen.getByText('Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants.')).toBeInTheDocument();
  });

  it('renders profile image with correct alt text', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const image = screen.getByAltText('Sarah');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProfile.images[0]);
  });

  it('renders interests as tags', () => {
    render(<ProfileCard {...defaultProps} />);
    
    expect(screen.getByText('Hiking')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const card = screen.getByText('Sarah').closest('div');
    expect(card).toHaveClass('bg-white', 'rounded-xl', 'overflow-hidden');
  });

  it('handles different index positions correctly', () => {
    const { rerender } = render(<ProfileCard {...defaultProps} />);
    
    // First card (index 0) should be draggable
    expect(screen.getByText('Sarah').closest('div')).toHaveAttribute('draggable', 'true');
    
    // Second card (index 1) should not be draggable
    rerender(<ProfileCard {...defaultProps} index={1} />);
    expect(screen.getByText('Sarah').closest('div')).toHaveAttribute('draggable', 'false');
  });

  it('calls setIsDragging when drag starts on first card', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const card = screen.getByText('Sarah').closest('div');
    fireEvent.dragStart(card!);
    
    expect(defaultProps.setIsDragging).toHaveBeenCalledWith(true);
  });

  it('does not call setIsDragging when drag starts on non-first card', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const card = screen.getByText('Sarah').closest('div');
    fireEvent.dragStart(card!);
    
    expect(defaultProps.setIsDragging).not.toHaveBeenCalled();
  });

  it('applies correct z-index based on card index', () => {
    const { rerender } = render(<ProfileCard {...defaultProps} />);
    
    // First card should have highest z-index
    let card = screen.getByText('Sarah').closest('div');
    expect(card).toHaveStyle({ zIndex: '10' });
    
    // Second card should have lower z-index
    rerender(<ProfileCard {...defaultProps} index={1} />);
    card = screen.getByText('Sarah').closest('div');
    expect(card).toHaveStyle({ zIndex: '9' });
  });

  it('handles isExiting prop correctly', () => {
    render(<ProfileCard {...defaultProps} isExiting={true} />);
    
    const card = screen.getByText('Sarah').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('limits interests display to first 3', () => {
    const profileWithManyInterests = {
      ...mockProfile,
      interests: ['Hiking', 'Photography', 'Coffee', 'Travel', 'Music', 'Art']
    };
    
    render(<ProfileCard {...defaultProps} profile={profileWithManyInterests} />);
    
    expect(screen.getByText('Hiking')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Travel')).not.toBeInTheDocument();
    expect(screen.queryByText('Music')).not.toBeInTheDocument();
    expect(screen.queryByText('Art')).not.toBeInTheDocument();
  });

  it('applies gradient overlay to profile image', () => {
    render(<ProfileCard {...defaultProps} />);
    
    const overlay = screen.getByText('Sarah').closest('div')?.querySelector('.bg-gradient-to-t');
    expect(overlay).toBeInTheDocument();
  });
});
