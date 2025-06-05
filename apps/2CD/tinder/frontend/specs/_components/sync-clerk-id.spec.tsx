import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClerkIdSync } from '../../src/components/sync-clerk-id';
import { useUser } from '@clerk/nextjs';
import { expect } from '@jest/globals';

// Mock the Clerk useUser hook
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key]),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ClerkIdSync', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset console.log mock
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('should not set clerkID when user is not loaded', () => {
    // Mock useUser to return not loaded state
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: false
    });

    render(<ClerkIdSync />);

    // Use type assertion for the mock function
    const setItemMock = localStorageMock.setItem as jest.Mock;
    expect(setItemMock).not.toHaveBeenCalled();
  });

  it('should not set clerkID when user is loaded but no user ID', () => {
    // Mock useUser to return loaded state but no user
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: true
    });

    render(<ClerkIdSync />);

    const setItemMock = localStorageMock.setItem as jest.Mock;
    expect(setItemMock).not.toHaveBeenCalled();
  });

  it('should set clerkID in localStorage when user is loaded and has ID', () => {
    const mockUserId = 'test-user-id';
    
    // Mock useUser to return loaded state with user
    (useUser as jest.Mock).mockReturnValue({
      user: { id: mockUserId },
      isLoaded: true
    });

    render(<ClerkIdSync />);

    const setItemMock = localStorageMock.setItem as jest.Mock;
    const consoleLogMock = console.log as jest.Mock;
    
    expect(setItemMock).toHaveBeenCalledWith('clerkID', mockUserId);
    expect(consoleLogMock).toHaveBeenCalledWith(
      '[ClerkIdSync] clerkID set in localStorage:',
      mockUserId
    );
  });

  it('should update clerkID when user ID changes', () => {
    const initialUserId = 'initial-user-id';
    const updatedUserId = 'updated-user-id';

    // Initial render with first user ID
    (useUser as jest.Mock).mockReturnValue({
      user: { id: initialUserId },
      isLoaded: true
    });

    const { rerender } = render(<ClerkIdSync />);

    const setItemMock = localStorageMock.setItem as jest.Mock;
    expect(setItemMock).toHaveBeenCalledWith('clerkID', initialUserId);

    // Update with new user ID
    (useUser as jest.Mock).mockReturnValue({
      user: { id: updatedUserId },
      isLoaded: true
    });

    rerender(<ClerkIdSync />);

    expect(setItemMock).toHaveBeenCalledWith('clerkID', updatedUserId);
  });

  it('should render null', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      isLoaded: false
    });

    const { container } = render(<ClerkIdSync />);
    // Check that the container is empty (component renders null)
    expect(container.firstChild).toBeNull();
  });
});









