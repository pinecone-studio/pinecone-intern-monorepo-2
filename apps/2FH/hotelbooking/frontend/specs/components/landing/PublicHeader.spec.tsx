import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PublicHeader } from '../../../src/components/landing-page/PublicHeader';
import { useOtpContext } from '../../../src/components/providers';
jest.mock('../../../src/components/providers', () => ({
  useOtpContext: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('PublicHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loader when loading', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ me: null, loading: true });
    render(<PublicHeader />);
    expect(screen.getByText('Pedia')).toBeInTheDocument();
    const placeholders = screen.getAllByRole('button', { hidden: true });
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('renders unauthenticated header', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ me: null, loading: false });
    render(<PublicHeader />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders authenticated header', () => {
    (useOtpContext as jest.Mock).mockReturnValue({
      me: { _id: '1', firstName: 'John', email: 'john@test.com' },
      loading: false,
    });
    render(<PublicHeader />);
    expect(screen.getByText('My booking')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('navigates correctly', () => {
    (useOtpContext as jest.Mock).mockReturnValue({ me: null, loading: false });
    render(<PublicHeader />);
    fireEvent.click(screen.getByText('Pedia'));
    expect(mockPush).toHaveBeenCalledWith('/');
    fireEvent.click(screen.getByText('Register'));
    expect(mockPush).toHaveBeenCalledWith('/signup');
    fireEvent.click(screen.getByText('Sign in'));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  it('shows user firstName or email in PopoverTrigger', () => {
    // Case 1: user has firstName
    (useOtpContext as jest.Mock).mockReturnValue({
      me: { _id: '1', firstName: 'John', email: 'john@test.com' },
      loading: false,
    });
    render(<PublicHeader />);
    expect(screen.getByText('John')).toBeInTheDocument(); // covers firstName branch

    // Case 2: user has no firstName
    (useOtpContext as jest.Mock).mockReturnValue({
      me: { _id: '2', firstName: '', email: 'jane@test.com' },
      loading: false,
    });
    render(<PublicHeader />);
    expect(screen.getByText('jane@test.com')).toBeInTheDocument(); // covers email branch
  });
});
