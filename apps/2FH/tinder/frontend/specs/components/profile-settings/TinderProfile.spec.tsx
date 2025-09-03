import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TinderProfile } from '@/components/profile-settings/TinderProfile';

describe('TinderProfile', () => {
  it('renders default components', () => {
    render(<TinderProfile />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('switches between profile and images sections', () => {
    render(<TinderProfile />);
    
    // Initially shows profile section
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    
    // Click on Images tab
    const imagesTab = screen.getByText('Images');
    fireEvent.click(imagesTab);
    
    // Should now show images section
    expect(screen.getByText('Profile Images')).toBeInTheDocument();
    
    // Click back to Profile tab
    const profileTab = screen.getByText('Profile');
    fireEvent.click(profileTab);
    
    // Should show profile section again
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders footer with correct content', () => {
    render(<TinderProfile />);
    
    // Check footer content
    expect(screen.getByText('tinder')).toBeInTheDocument();
    expect(screen.getByText('© Copyright 2024')).toBeInTheDocument();
  });

  it('renders main content area with correct styling', () => {
    render(<TinderProfile />);
    
    const mainContent = screen.getByText('Personal Information').closest('main');
    expect(mainContent).toHaveClass('flex-1 flex justify-center px-4 py-3');
  });
});