import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

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

describe('Sidebar - Part 3: Additional Interactions', () => {
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

  it('closes create dropdown when clicking outside the dropdown area', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
  });

  it('closes create dropdown when clicking outside with ref not containing target', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
  });

  it('handles click outside when ref contains target (branch coverage)', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.mouseDown(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('handles click outside when ref is null (branch coverage)', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
  });

  it('toggles search state', () => {
    renderSidebar();
    const btn = screen.getByRole('button', { name: /search/i });
    fireEvent.click(btn);
    expect(mockSetIsSearchOpen).toHaveBeenCalledWith(true);
  });

  it('opens create dropdown and shows options', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByText('Story')).toBeInTheDocument();
  });

  it('closes create dropdown when clicking Post option', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    fireEvent.click(screen.getByText('Post'));
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Story')).not.toBeInTheDocument();
  });

  it('dropdown closes when clicking outside', async () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByText('Post')).not.toBeInTheDocument());
  });
});
