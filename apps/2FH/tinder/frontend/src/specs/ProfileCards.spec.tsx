import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileCards } from '../components/swipe/ProfileCards';
import { mockProfiles } from '../components/swipe/MockData';

// Mock the ProfileCard component
jest.mock('../components/swipe/ProfileCard', () => ({
  ProfileCard: ({ profile, index }: any) => (
    <div data-testid={`profile-card-${index}`}>
      <span>{profile.name}</span>
      <span>{profile.profession}</span>
    </div>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ProfileCards', () => {
  const mockVisibleProfiles = mockProfiles.slice(0, 3);
  const mockIsDragging = false;
  const mockSetIsDragging = jest.fn();
  const mockAnimatingCards = new Set<string>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all visible profiles', () => {
    render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getByTestId('profile-card-0')).toBeInTheDocument();
    expect(screen.getByTestId('profile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('profile-card-2')).toBeInTheDocument();
  });

  it('renders profile information correctly', () => {
    render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getByText('Sarah')).toBeInTheDocument();
    expect(screen.getByText('Marketing Manager')).toBeInTheDocument();
    expect(screen.getByText('Michael')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('applies correct container styling', () => {
    render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    const container = screen.getByTestId('profile-card-0').closest('div');
    expect(container).toHaveClass('relative', 'mb-12');
    expect(container).toHaveStyle({ height: '600px' });
  });

  it('renders correct number of profile cards', () => {
    const { rerender } = render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(3);

    // Test with different number of profiles
    const fewerProfiles = mockProfiles.slice(0, 2);
    rerender(
      <ProfileCards
        visibleProfiles={fewerProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(2);
  });

  it('passes correct props to ProfileCard components', () => {
    render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    const firstCard = screen.getByTestId('profile-card-0');
    const secondCard = screen.getByTestId('profile-card-1');

    expect(firstCard).toBeInTheDocument();
    expect(secondCard).toBeInTheDocument();
  });

  it('handles empty visible profiles array', () => {
    render(
      <ProfileCards
        visibleProfiles={[]}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.queryByTestId(/profile-card-/)).not.toBeInTheDocument();
  });

  it('handles single profile correctly', () => {
    const singleProfile = [mockProfiles[0]];
    
    render(
      <ProfileCards
        visibleProfiles={singleProfile}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getByTestId('profile-card-0')).toBeInTheDocument();
    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(1);
  });

  it('renders without crashing', () => {
    expect(() =>
      render(
        <ProfileCards
          visibleProfiles={mockVisibleProfiles}
          _isDragging={mockIsDragging}
          _setIsDragging={mockSetIsDragging}
          animatingCards={mockAnimatingCards}
        />
      )
    ).not.toThrow();
  });

  it('maintains consistent layout structure', () => {
    const { container } = render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('relative', 'mb-12');
    expect(mainContainer).toHaveStyle({ height: '600px' });
  });

  it('handles animating cards correctly', () => {
    const animatingCardsWithData = new Set([mockProfiles[0].id, mockProfiles[1].id]);
    
    render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={mockIsDragging}
        _setIsDragging={mockSetIsDragging}
        animatingCards={animatingCardsWithData}
      />
    );

    // Component should still render all cards
    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(3);
  });

  it('handles different dragging states', () => {
    const { rerender } = render(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={false}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(3);

    rerender(
      <ProfileCards
        visibleProfiles={mockVisibleProfiles}
        _isDragging={true}
        _setIsDragging={mockSetIsDragging}
        animatingCards={mockAnimatingCards}
      />
    );

    expect(screen.getAllByTestId(/profile-card-/)).toHaveLength(3);
  });
});
