import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '@/components/admin/room-detail/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message correctly', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorMessage message={errorMessage} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<ErrorMessage message="Test error" />);

    const errorTitle = screen.getByText('Error');
    expect(errorTitle).toHaveClass('text-red-600');

    const container = errorTitle.closest('.min-h-screen');
    expect(container).toHaveClass('bg-gray-50', 'p-6');
  });

  it('displays AlertCircle icon', () => {
    render(<ErrorMessage message="Test error" />);

    const icon = screen.getByText('Error').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders within proper card structure', () => {
    render(<ErrorMessage message="Test error" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    // Check that the message is within a card structure
    const messageElement = screen.getByText('Test error');
    expect(messageElement).toHaveClass('text-gray-700');
  });

  it('handles empty error message', () => {
    render(<ErrorMessage message="" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    // Check that the error message paragraph exists (even if empty)
    const errorMessageElement = document.querySelector('.text-gray-700');
    expect(errorMessageElement).toBeInTheDocument();
  });

  it('handles long error messages', () => {
    const longMessage =
      'This is a very long error message that might wrap to multiple lines and should still be displayed correctly without breaking the layout or causing any issues with the component rendering.';
    render(<ErrorMessage message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<ErrorMessage message="Test error" />);

    // Check that the error title is properly structured
    const errorTitle = screen.getByText('Error');
    expect(errorTitle).toBeInTheDocument();

    // Check that the message is accessible
    const message = screen.getByText('Test error');
    expect(message).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ErrorMessage message="Test error message" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
