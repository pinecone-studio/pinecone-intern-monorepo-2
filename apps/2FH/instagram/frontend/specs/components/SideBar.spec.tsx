import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '@/components/Sidebar';
import { useNavigation } from '@/components';
import { usePathname } from 'next/navigation';
import { NavigationProvider } from '@/components/NavigationProvider/NavigationProvider';
jest.mock('@/components', () => ({ useNavigation: jest.fn() }));
jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
jest.mock('@/components/create-post-dialog/CreatePostDialog', () => ({
  CreatePostDialog: () => null,
}));
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
    <NavigationProvider>
      <Sidebar />
    </NavigationProvider>
  );
};
describe('Sidebar - Part 1: Event Listeners and Click Outside', () => {
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
  it('adds and removes click outside listener', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderSidebar();
    expect(addSpy).toHaveBeenCalled();
    unmount();
    expect(removeSpy).toHaveBeenCalled();
  });
  it('cleanup function removes event listener on unmount', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderSidebar();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
  it('click outside closes create dropdown and triggers cleanup', () => {
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
    const { unmount } = renderSidebar();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
  it('click outside event handler is properly set up and cleaned up', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderSidebar();
    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    const addedFunction = addSpy.mock.calls[0][1];
    const removedFunction = removeSpy.mock.calls[0][1];
    expect(addedFunction).toBe(removedFunction);
  });
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
    (expect(mockSetIsSearchOpen) as any).toHaveBeenCalledWith(true);
  });
  it('hides logo and more when search is open', () => {
    mockUseNavigation.mockReturnValue({
      isSearchOpen: true,
      setIsSearchOpen: jest.fn(),
      currentPage: 'home',
      setCurrentPage: jest.fn(),
    });
    renderSidebar();
    (expect(screen.queryByAltText(/instagram/i)) as any).not.toBeInTheDocument();
    (expect(screen.queryByText(/more/i)) as any).not.toBeInTheDocument();
  });
  it('create dropdown toggles and opens story dialog', async () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByText('Story')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Story'));
    (expect(screen.getByTestId('story-dialog')) as any).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-dialog'));
    (expect(screen.queryByTestId('story-dialog')) as any).not.toBeInTheDocument();
  });
  it('Post button closes create dropdown', () => {
    renderSidebar();
    const createBtn = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createBtn);
    expect(screen.getByText('Post')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Post'));
    expect(screen.queryByText('Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Story')).not.toBeInTheDocument();
  });
  it('dropdown closes when clicking outside', async () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    fireEvent.mouseDown(document.body);
    await waitFor(() => (expect(screen.queryByText('Post')) as any).not.toBeInTheDocument());
  });
});
