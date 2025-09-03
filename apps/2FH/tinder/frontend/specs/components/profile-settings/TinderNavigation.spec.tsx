import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TinderNavigation } from '@/components/profile-settings/TinderNavigation';

describe('TinderNavigation Component', () => {
  const mockOnSectionChange = jest.fn();
  const defaultProps = {
    activeSection: 'profile' as const,
    onSectionChange: mockOnSectionChange,
  };

  beforeEach(() => {
    mockOnSectionChange.mockClear();
  });

  it('renders navigation with two buttons', () => {
    render(<TinderNavigation {...defaultProps} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
  });

  it('applies active class to the current section button', () => {
    render(<TinderNavigation {...defaultProps} />);
    const profileButton = screen.getByText('Profile');
    expect(profileButton).toHaveClass('bg-gray-200 text-gray-800');

    const imagesButton = screen.getByText('Images');
    expect(imagesButton).toHaveClass('text-gray-700 hover:bg-gray-100 hover:text-gray-900');
  });

  it('calls onSectionChange when a button is clicked', () => {
    render(<TinderNavigation {...defaultProps} />);
    const imagesButton = screen.getByText('Images');
    fireEvent.click(imagesButton);
    expect(mockOnSectionChange).toHaveBeenCalledWith('images');

    const profileButton = screen.getByText('Profile');
    fireEvent.click(profileButton);
    expect(mockOnSectionChange).toHaveBeenCalledWith('profile');
  });

  it('applies correct classes when active section changes', () => {
    render(<TinderNavigation {...defaultProps} activeSection="images" />);
    const imagesButton = screen.getByText('Images');
    expect(imagesButton).toHaveClass('bg-gray-200 text-gray-800');

    const profileButton = screen.getByText('Profile');
    expect(profileButton).toHaveClass('text-gray-700 hover:bg-gray-100 hover:text-gray-900');
  });

  it('renders nav container with correct styling', () => {
    render(<TinderNavigation {...defaultProps} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('w-48 bg-white p-3');
    expect(nav.querySelector('div')).toHaveClass('space-y-2');
  });
});