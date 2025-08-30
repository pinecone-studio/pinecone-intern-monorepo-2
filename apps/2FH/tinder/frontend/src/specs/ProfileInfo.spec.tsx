import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileInfo } from '../components/swipe/ProfileInfo';
import { mockProfiles } from '../components/swipe/MockData';

describe('ProfileInfo', () => {
  const mockProfile = mockProfiles[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile name and age correctly', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    expect(screen.getByText('Sarah')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders profession correctly', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    expect(screen.getByText('Marketing Manager')).toBeInTheDocument();
  });

  it('renders bio correctly', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    expect(screen.getByText('Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants.')).toBeInTheDocument();
  });

  it('renders first 3 interests as tags', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    expect(screen.getByText('Hiking')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
  });

  it('limits interests display to first 3 even when more exist', () => {
    const profileWithManyInterests = {
      ...mockProfile,
      interests: ['Hiking', 'Photography', 'Coffee', 'Travel', 'Music', 'Art']
    };
    
    render(<ProfileInfo profile={profileWithManyInterests} />);
    
    expect(screen.getByText('Hiking')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Travel')).not.toBeInTheDocument();
    expect(screen.queryByText('Music')).not.toBeInTheDocument();
    expect(screen.queryByText('Art')).not.toBeInTheDocument();
  });

  it('applies correct styling classes to interest tags', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    const interestTags = screen.getAllByText(/Hiking|Photography|Coffee/);
    interestTags.forEach(tag => {
      expect(tag).toHaveClass('px-3', 'py-1', 'bg-white/20', 'backdrop-blur-sm', 'text-white', 'rounded-full', 'text-xs', 'font-medium', 'border', 'border-white/30');
    });
  });

  it('applies correct positioning classes', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    const nameSection = screen.getByText('Sarah').closest('div');
    const bioSection = screen.getByText('Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants.').closest('div');
    
    expect(nameSection).toHaveClass('absolute', 'bottom-28', 'left-6', 'right-6');
    expect(bioSection).toHaveClass('absolute', 'bottom-6', 'left-6', 'right-6');
  });

  it('applies correct text styling classes', () => {
    render(<ProfileInfo profile={mockProfile} />);
    
    const name = screen.getByText('Sarah');
    const age = screen.getByText('25');
    const profession = screen.getByText('Marketing Manager');
    const bio = screen.getByText('Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants.');
    
    expect(name).toHaveClass('text-3xl', 'font-bold', 'mb-2', 'drop-shadow-lg');
    expect(age).toHaveClass('font-light');
    expect(profession).toHaveClass('text-white/90', 'text-lg', 'font-medium', 'drop-shadow-md', 'mb-2');
    expect(bio).toHaveClass('text-white/90', 'text-sm', 'leading-relaxed', 'mb-2', 'drop-shadow-md');
  });

  it('calculates age correctly from date of birth', () => {
    const currentYear = new Date().getFullYear();
    const profileWithSpecificAge = {
      ...mockProfile,
      dateOfBirth: `${currentYear - 30}-01-01`
    };
    
    render(<ProfileInfo profile={profileWithSpecificAge} />);
    
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('handles edge case age calculation correctly', () => {
    const today = new Date();
    const profileWithTodayBirthday = {
      ...mockProfile,
      dateOfBirth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    };
    
    render(<ProfileInfo profile={profileWithTodayBirthday} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders with different profile data', () => {
    const differentProfile = mockProfiles[1];
    
    render(<ProfileInfo profile={differentProfile} />);
    
    expect(screen.getByText(differentProfile.name)).toBeInTheDocument();
    expect(screen.getByText(differentProfile.profession)).toBeInTheDocument();
    expect(screen.getByText(differentProfile.bio)).toBeInTheDocument();
  });
});
