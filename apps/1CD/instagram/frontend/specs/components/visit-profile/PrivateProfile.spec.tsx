/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivateProfile from '@/components/visit-profile/PrivateProfile';

jest.mock('lucide-react', () => ({
  Lock: () => <svg data-testid="lock-icon"></svg>,
}));

describe('PrivateProfile Component', () => {
  const mockHandleButtonClick = jest.fn(() => Promise.resolve());

  const setup = (props = {}) => {
    const defaultProps = {
      followLoading: false,
      buttonText: 'Follow',
      handleButtonClick: mockHandleButtonClick,
    };

    return render(<PrivateProfile {...defaultProps} {...props} />);
  };

  it('renders the component with the correct text and elements', () => {
    setup();

    expect(screen.getByText('This account is private')).toBeInTheDocument();
    expect(screen.getByText('Follow to see their photos and videos')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('disables the button and applies styles when followLoading is true', () => {
    setup({ followLoading: true });

    const button = screen.getByRole('button', { name: /follow/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('calls handleButtonClick when the button is clicked', async () => {
    setup();

    const button = screen.getByRole('button', { name: /follow/i });
    fireEvent.click(button);

    expect(mockHandleButtonClick).toHaveBeenCalledTimes(1);
  });
});
