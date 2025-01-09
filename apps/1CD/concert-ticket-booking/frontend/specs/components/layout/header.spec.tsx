import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../src/components/header/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQueryState } from 'nuqs';

// Mocks
jest.mock('@/components/providers/AuthProvider');
jest.mock('nuqs', () => ({
  useQueryState: jest.fn(),
}));

const mockSignout = jest.fn();

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders the header elements', () => {
    const setQMock = jest.fn();

    // Mock useQueryState
    (useQueryState as jest.Mock).mockReturnValue(['mocked-query', setQMock]);
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signout: mockSignout,
    });

    render(<Header />);

    expect(screen.getByTestId('SignUpBtn')).toBeInTheDocument();
    expect(screen.getByTestId('SignInBtn')).toBeInTheDocument();
  });

  it('displays the SignOut button when user is present', () => {
    const setQMock = jest.fn();

    // Mock useQueryState
    (useQueryState as jest.Mock).mockReturnValue(['mocked-query', setQMock]);
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signout: mockSignout,
    });

    render(<Header />);

    expect(screen.getByTestId('SignOutBtn')).toBeInTheDocument();
    // const { getByTestId } = render(<Header />);

    // expect(getByTestId('UserEmail'));
    // expect(getByTestId('SignOutBtn'));
  });

  it('calls setQ when search input changes', () => {
    const setQMock = jest.fn();

    // Mock useQueryState
    (useQueryState as jest.Mock).mockReturnValue(['mocked-query', setQMock]);

    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signout: mockSignout,
    });

    render(<Header />);

    // Verify the input exists before interacting
    const searchInput = screen.getByTestId('Search-Input');
    fireEvent.change(searchInput, { target: { value: 'salhi' } });

    // Verify setQ is called with the correct value
    expect(setQMock).toHaveBeenCalledWith('salhi');
  });
  it('closes the dropdown when a link is clicked', async () => {
    const setQMock = jest.fn();

    // Mock useQueryState
    (useQueryState as jest.Mock).mockReturnValue(['', setQMock]);
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signout: mockSignout,
    });

    render(<Header />);

    // Wait for dropdown trigger to appear
    const dropdownTrigger = await screen.findByTestId('dropdown-trigger');
    fireEvent.click(dropdownTrigger);

    // Wait for dropdown content to be visible
    const eventsLink = await screen.findByTestId('EventsCl');
    expect(eventsLink).toBeInTheDocument();

    // Click on the "Events" link to close the dropdown
    fireEvent.click(eventsLink);

    // Ensure the dropdown is now closed
    await waitFor(() => expect(screen.queryByTestId('EventsCl')).not.toBeInTheDocument());
  });
});
