import { render, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClerkIdContext, useClerkId, useGetClerkId } from '@/components/syncclerkid';
import { useUser } from '@clerk/nextjs';
import { ReactNode, useContext } from 'react';

// Mock the Clerk useUser hook
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}));

describe('syncclerkid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useClerkId', () => {
    it('should return null when user is not loaded', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: false
      });

      const { result } = renderHook(() => useClerkId());
      expect(result.current.clerkId).toBeNull();
    });

    it('should return null when user is loaded but null', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true
      });

      const { result } = renderHook(() => useClerkId());
      expect(result.current.clerkId).toBeNull();
    });

    it('should return clerkId when user is loaded and has ID', () => {
      const mockUserId = 'test-user-id';
      (useUser as jest.Mock).mockReturnValue({
        user: { id: mockUserId },
        isLoaded: true
      });

      const { result } = renderHook(() => useClerkId());
      expect(result.current.clerkId).toBe(mockUserId);
    });
  });

  describe('useGetClerkId', () => {
    it('should return the clerk ID from useClerkId', () => {
      const mockUserId = 'test-user-id';
      (useUser as jest.Mock).mockReturnValue({
        user: { id: mockUserId },
        isLoaded: true
      });

      const { result } = renderHook(() => useGetClerkId());
      expect(result.current).toBe(mockUserId);
    });

    it('should return null when no user', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true
      });

      const { result } = renderHook(() => useGetClerkId());
      expect(result.current).toBeNull();
    });
  });

  describe('ClerkIdContext', () => {
    it('should have default value of null', () => {
      const TestComponent = () => {
        const context = useContext(ClerkIdContext);
        return <div data-testid="test">{context.clerkId || 'null'}</div>;
      };

      const { getByTestId } = render(<TestComponent />);
      expect(getByTestId('test')).toHaveTextContent('null');
    });

    it('should provide clerkId value to children', () => {
      const mockClerkId = 'test-clerk-id';
      const TestProvider = ({ children }: { children: ReactNode }) => (
        <ClerkIdContext.Provider value={{ clerkId: mockClerkId }}>
          {children}
        </ClerkIdContext.Provider>
      );

      const TestComponent = () => {
        const context = useContext(ClerkIdContext);
        return <div data-testid="test">{context.clerkId}</div>;
      };

      const { getByTestId } = render(
        <TestProvider>
          <TestComponent />
        </TestProvider>
      );

      expect(getByTestId('test')).toHaveTextContent(mockClerkId);
    });
  });
}); 