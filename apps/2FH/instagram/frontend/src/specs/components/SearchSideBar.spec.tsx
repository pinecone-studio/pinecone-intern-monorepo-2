// apps/2FH/instagram/frontend/src/specs/components/SearchSidebar.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchSidebar } from '@/components/SearchSidebar';
import { useNavigation } from '@/components/NavigationProvider/NavigationProvider';

jest.mock('@/components/NavigationProvider/NavigationProvider', () => {
  const original = jest.requireActual('@/components/NavigationProvider/NavigationProvider');
  return {
    ...original,
    useNavigation: jest.fn(),
  };
});

const mockedUseNavigation = useNavigation as jest.Mock;

describe('SearchSidebar', () => {
  beforeEach(() => {
    mockedUseNavigation.mockReturnValue({
      isSearchOpen: true,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });
  });

  it('should not render when isSearchOpen is false', () => {
    mockedUseNavigation.mockReturnValue({
      isSearchOpen: false,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });

    const { container } = render(<SearchSidebar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders header and recent searches when open', () => {
    render(<SearchSidebar />);

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
    expect(screen.getByText('rosso_blanc')).toBeInTheDocument();
  });

  it('shows no results when search query entered', () => {
    render(<SearchSidebar />);
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('clears input when clear button clicked', () => {
    render(<SearchSidebar />);
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);

    expect(input).toHaveValue('');
  });

  it('calls clearAllRecent when button clicked', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Intentionally empty to suppress console logs during test
    });
    render(<SearchSidebar />);

    const clearAllBtn = screen.getByText('Clear all');
    fireEvent.click(clearAllBtn);
    expect(logSpy).toHaveBeenCalledWith('Clear all recent searches');
    logSpy.mockRestore();
  });
});
