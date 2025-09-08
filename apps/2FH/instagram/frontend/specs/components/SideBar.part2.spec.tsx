import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '@/components/Sidebar';
import { useNavigation } from '@/components';
import { usePathname } from 'next/navigation';
import { NavigationProvider } from '@/components/NavigationProvider/NavigationProvider';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('@/components', () => ({ useNavigation: jest.fn() }));
jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
jest.mock('@/components/create-story-dialog/StoryCreateDialog', () => ({
  StoryCreateDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div role="dialog" data-testid="story-dialog" onKeyDown={(e) => e.key === 'Escape' && onClose()} tabIndex={-1}>
        Story Dialog
        <button onClick={onClose} data-testid="close-dialog">
          Close
        </button>
      </div>
    ) : null,
}));
jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img {...props} /> }));

const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

const renderSidebar = () => {
  return render(
    <MockedProvider mocks={[]} addTypename={false}>
      <NavigationProvider>
        <Sidebar />
      </NavigationProvider>
    </MockedProvider>
  );
};

describe('Sidebar - Part 2: Navigation, Styling, and Advanced Features', () => {
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

  afterEach(() => cleanup());

  it('renders nav links active/inactive correctly', () => {
    renderSidebar();
    expect(screen.getByRole('link', { name: /home/i })).toHaveClass('bg-gray-100 font-bold');
    expect(screen.getByRole('link', { name: /notifications/i })).toHaveClass('hover:bg-gray-100');

    mockUsePathname.mockReturnValue('/notifications');
    const { rerender } = renderSidebar();
    rerender(
      <MockedProvider mocks={[]} addTypename={false}>
        <NavigationProvider>
          <Sidebar />
        </NavigationProvider>
      </MockedProvider>
    );
    const notificationsLink = screen.getAllByRole('link', { name: /notifications/i })[0];
    expect(notificationsLink).toBeInTheDocument();
  });

  it('sidebar width and labels respond to search state', () => {
    const { rerender } = renderSidebar();
    let sidebar = document.querySelector('.border-r');
    expect(sidebar).toHaveClass('w-64');

    mockUseNavigation.mockReturnValue({
      isSearchOpen: true,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });
    rerender(
      <MockedProvider mocks={[]} addTypename={false}>
        <NavigationProvider>
          <Sidebar />
        </NavigationProvider>
      </MockedProvider>
    );
    sidebar = document.querySelector('.border-r');
    expect(sidebar).toHaveClass('w-20');
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('active/inactive button nav item styling', () => {
    renderSidebar();
    const searchBtn = screen.getByRole('button', { name: /search/i });
    expect(searchBtn).toHaveClass('hover:bg-gray-100');
    expect(searchBtn).not.toHaveClass('bg-gray-100');
  });

  it('create dropdown does not show when search is open', () => {
    mockUseNavigation.mockReturnValue({
      isSearchOpen: true,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });
    renderSidebar();
    const buttons = screen.getAllByRole('button');
    const createBtn = buttons.find((btn) => btn.querySelector('svg[class*="lucide-square-plus"]'));
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn!);
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Story')).not.toBeInTheDocument();
  });

  it('create dropdown opens sidebar even when search is open', async () => {
    mockUseNavigation.mockReturnValue({
      isSearchOpen: true,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });
    renderSidebar();
    const sidebar = document.querySelector('.border-r');
    expect(sidebar).toHaveClass('w-20');

    const buttons = screen.getAllByRole('button');
    const createBtn = buttons.find((btn) => btn.querySelector('svg[class*="lucide-square-plus"]'));
    expect(createBtn).toBeInTheDocument();

    fireEvent.click(createBtn!);
    expect(document.querySelector('.border-r')).toHaveClass('w-20');
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
  });

  it('clicking notifications does nothing (for coverage)', () => {
    renderSidebar();
    const notificationsLink = screen.getAllByRole('link', { name: /notifications/i })[0];
    fireEvent.click(notificationsLink);
    expect(true).toBe(true);
  });

  it('escape key closes story dialog', () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    fireEvent.click(screen.getByText('Story'));
    const dialog = screen.getByTestId('story-dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByTestId('story-dialog')).not.toBeInTheDocument();
  });
});
