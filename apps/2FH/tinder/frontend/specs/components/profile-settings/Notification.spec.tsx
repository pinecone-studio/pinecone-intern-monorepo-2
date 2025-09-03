import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Notification } from '@/components/profile-settings/Notification';

describe('Notification Component', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    message: 'Test notification message',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders notification with correct message and title', () => {
    render(<Notification {...defaultProps} />);
    expect(screen.getByText('Profile Updated Successfully')).toBeInTheDocument();
    expect(screen.getByText('Test notification message')).toBeInTheDocument();
  });

  it('renders with correct styling and structure', () => {
    render(<Notification {...defaultProps} />);
    
    // Find the outer container with fixed positioning
    const outerContainer = screen.getByText('Test notification message').closest('div.fixed');
    expect(outerContainer).toHaveClass('fixed bottom-4 right-4 z-50');
    
    // Find the inner container with background styling
    const innerContainer = outerContainer?.querySelector('div.bg-green-50');
    expect(innerContainer).toHaveClass('bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm');
    
    // Check for the checkmark icon
    const checkmarkIcon = innerContainer?.querySelector('svg');
    expect(checkmarkIcon).toHaveClass('w-5 h-5 text-green-400');
  });

  it('triggers onClose callback when close button is clicked', () => {
    render(<Notification {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button with correct attributes', () => {
    render(<Notification {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveClass('inline-flex text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600');
    expect(closeButton.querySelector('svg')).toHaveClass('w-4 h-4');
  });

  it('renders correctly with empty message', () => {
    render(<Notification {...defaultProps} message="" />);
    expect(screen.getByText('Profile Updated Successfully')).toBeInTheDocument();
    expect(screen.queryByText('Test notification message')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Close button still present
  });
});