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
});
