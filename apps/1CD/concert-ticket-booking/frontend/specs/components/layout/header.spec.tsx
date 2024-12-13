import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/components/header/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { jest } from '@jest/globals';

jest.mock('@/components/providers/AuthProvider');

const mockSignout = jest.fn();

(useAuth as jest.Mock).mockReturnValue({
  user: null,
  signout: mockSignout,
});

describe('Header Component', () => {
  it('renders the header elements', () => {
    const { getByTestId } = render(<Header />);
    expect(getByTestId('SignUpBtn'));
    expect(getByTestId('SignInBtn'));
  });

  it('displays the SignOut button when user is present', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'Test User' },
      signout: mockSignout,
    });

    const { getByTestId } = render(<Header />);

    expect(getByTestId('SignOutBtn'));
  });
});
