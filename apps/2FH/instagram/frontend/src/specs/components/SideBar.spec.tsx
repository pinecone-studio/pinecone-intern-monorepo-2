// apps/2FH/instagram/frontend/src/specs/components/Sidebar.full.spec.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '@/components/Sidebar';
import { useNavigation } from '@/components';
import { usePathname } from 'next/navigation';

jest.mock('@/components', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element
  const MockImage = ({ src, alt, ...props }: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Sidebar Full Coverage Tests', () => {
  const mockSetIsSearchOpen = jest.fn();
  const mockSetCurrentPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({
      isSearchOpen: false,
      setIsSearchOpen: mockSetIsSearchOpen,
      currentPage: 'home',
      setCurrentPage: mockSetCurrentPage,
    });
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Search button & state', () => {
    it('toggles search state when search button is clicked', () => {
      render(<Sidebar />);
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      expect(mockSetIsSearchOpen).toHaveBeenCalledWith(true);
    });

    it('hides logo and more button when search is open', () => {
      mockUseNavigation.mockReturnValue({
        isSearchOpen: true,
        setIsSearchOpen: jest.fn(),
        currentPage: 'home',
        setCurrentPage: jest.fn(),
      });
      render(<Sidebar />);
      expect(screen.queryByAltText(/instagram/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/more/i)).not.toBeInTheDocument();
    });
  });

  describe('Create dropdown functionality', () => {
    it('opens dropdown when create button clicked', () => {
      render(<Sidebar />);
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      expect(screen.getByText('Post')).toBeInTheDocument();
      expect(screen.getByText('Story')).toBeInTheDocument();
    });

    it('closes dropdown when Post clicked', () => {
      render(<Sidebar />);
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      fireEvent.click(screen.getByText('Post'));
      expect(screen.queryByText('Post')).not.toBeInTheDocument();
      expect(screen.queryByText('Story')).not.toBeInTheDocument();
    });

    it('closes dropdown when Story clicked', () => {
      render(<Sidebar />);
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      fireEvent.click(screen.getByText('Story'));
      expect(screen.queryByText('Post')).not.toBeInTheDocument();
      expect(screen.queryByText('Story')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      render(<Sidebar />);
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      expect(screen.getByText('Post')).toBeInTheDocument();
      fireEvent.mouseDown(document.body);
      await waitFor(() => {
        expect(screen.queryByText('Post')).not.toBeInTheDocument();
      });
    });

    it('keeps dropdown open when clicking inside', () => {
      render(<Sidebar />);
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      const dropdown = screen.getByText('Post').closest('div');
      if (dropdown) {
        fireEvent.mouseDown(dropdown);
      }
      expect(screen.getByText('Post')).toBeInTheDocument();
    });
  });

  describe('Navigation items', () => {
    it('renders active nav items correctly', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Sidebar />);
      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass('bg-gray-100');
      expect(homeLink).toHaveClass('font-bold');
    });

    it('renders inactive link items correctly', () => {
      mockUsePathname.mockReturnValue('/some-other');
      render(<Sidebar />);
      const notificationsLink = screen.getByRole('link', { name: /notifications/i });
      expect(notificationsLink).toHaveClass('hover:bg-gray-100');
      expect(notificationsLink).not.toHaveClass('bg-gray-100');
    });

    it('renders inactive button nav items correctly', () => {
      render(<Sidebar />);
      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toHaveClass('hover:bg-gray-100');
      expect(searchButton).not.toHaveClass('bg-gray-100');
    });
  });
});
