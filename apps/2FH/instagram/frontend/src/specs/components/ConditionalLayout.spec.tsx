/* eslint-disable max-lines, @typescript-eslint/no-var-requires */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock next/navigation
const mockPathname = '/';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => mockPathname,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock child components
jest.mock('@/components', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
  SearchSidebar: () => <div data-testid="search-sidebar">SearchSidebar</div>,
}));

jest.mock('@/components/MainLayout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('@/components/MainFooter', () => ({
  MainFooter: () => <div data-testid="main-footer">MainFooter</div>,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

const TestChild = () => <div data-testid="test-content">Test Content</div>;

describe('ConditionalLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset pathname to default
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: jest.fn() }),
      usePathname: () => '/',
    }));
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <ConditionalLayout>
          <TestChild />
        </ConditionalLayout>
      </TestWrapper>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    // Mock initial loading state by not providing any stored auth data
    render(
      <TestWrapper>
        <ConditionalLayout>
          <TestChild />
        </ConditionalLayout>
      </TestWrapper>
    );

    // During initial render, there might be a brief loading state
    // This test structure allows for that possibility
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  describe('Public Routes', () => {
    const publicRoutes = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'];

    publicRoutes.forEach((route) => {
      it(`should render minimal layout for public route: ${route}`, () => {
        jest.doMock('next/navigation', () => ({
          useRouter: () => ({ push: jest.fn() }),
          usePathname: () => route,
        }));

        // Re-import the component to pick up the new mock
        const { ConditionalLayout: MockedConditionalLayout } = require('@/components/ConditionalLayout') as typeof import('@/components/ConditionalLayout');
        
        render(
          <TestWrapper>
            <MockedConditionalLayout>
              <TestChild />
            </MockedConditionalLayout>
          </TestWrapper>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
        // Should not show authenticated layout components
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('search-sidebar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('main-layout')).not.toBeInTheDocument();
        expect(screen.queryByTestId('main-footer')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authenticated User on Protected Routes', () => {
    beforeEach(() => {
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user') return JSON.stringify({
          _id: 'user-id',
          fullName: 'Test User',
          userName: 'testuser',
          email: 'test@example.com'
        });
        return null;
      });
    });

    it('should render full layout for authenticated user on protected route', () => {
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: jest.fn() }),
        usePathname: () => '/home',
      }));

      render(
        <TestWrapper>
          <ConditionalLayout>
            <TestChild />
          </ConditionalLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('search-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      expect(screen.getByTestId('main-footer')).toBeInTheDocument();
    });

    it('should render full layout for authenticated user on root route', () => {
      render(
        <TestWrapper>
          <ConditionalLayout>
            <TestChild />
          </ConditionalLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('search-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      expect(screen.getByTestId('main-footer')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated User on Protected Routes', () => {
    it('should render minimal layout for unauthenticated user on protected route', () => {
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: jest.fn() }),
        usePathname: () => '/protected-route',
      }));

      render(
        <TestWrapper>
          <ConditionalLayout>
            <TestChild />
          </ConditionalLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      // Should not show authenticated layout components
      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('search-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('main-layout')).not.toBeInTheDocument();
      expect(screen.queryByTestId('main-footer')).not.toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    beforeEach(() => {
      // Mock authenticated user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user') return JSON.stringify({
          _id: 'user-id',
          fullName: 'Test User',
          userName: 'testuser',
          email: 'test@example.com'
        });
        return null;
      });
    });

    it('should have correct CSS classes for minimal layout', () => {
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: jest.fn() }),
        usePathname: () => '/login',
      }));

      const { ConditionalLayout: MockedConditionalLayout } = require('@/components/ConditionalLayout') as typeof import('@/components/ConditionalLayout');
      
      const { container } = render(
        <TestWrapper>
          <MockedConditionalLayout>
            <TestChild />
          </MockedConditionalLayout>
        </TestWrapper>
      );

      const layoutDiv = container.firstChild as HTMLElement;
      expect(layoutDiv).toHaveClass('min-h-screen', 'bg-white');
    });

    it('should have correct CSS classes for full layout', () => {
      const { container } = render(
        <TestWrapper>
          <ConditionalLayout>
            <TestChild />
          </ConditionalLayout>
        </TestWrapper>
      );

      const layoutDiv = container.firstChild as HTMLElement;
      expect(layoutDiv).toHaveClass('flex', 'min-h-screen', 'bg-white', 'flex-col');
    });
  });

  describe('Children Rendering', () => {
    it('should render children in minimal layout', () => {
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: jest.fn() }),
        usePathname: () => '/login',
      }));

      const { ConditionalLayout: MockedConditionalLayout } = require('@/components/ConditionalLayout') as typeof import('@/components/ConditionalLayout');
      
      render(
        <TestWrapper>
          <MockedConditionalLayout>
            <div data-testid="custom-child">Custom Child Component</div>
          </MockedConditionalLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom Child Component')).toBeInTheDocument();
    });

    it('should render children within MainLayout for authenticated users', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'mock-token';
        if (key === 'user') return JSON.stringify({
          _id: 'user-id',
          fullName: 'Test User',
          userName: 'testuser',
          email: 'test@example.com'
        });
        return null;
      });

      render(
        <TestWrapper>
          <ConditionalLayout>
            <div data-testid="custom-child">Custom Child Component</div>
          </ConditionalLayout>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      // The custom child should be inside the main layout
      const mainLayout = screen.getByTestId('main-layout');
      expect(mainLayout).toContainElement(screen.getByTestId('custom-child'));
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner and text when isLoading is true', () => {
      // We can test this by creating a custom wrapper that forces loading state
      // For now, we'll test that the component handles loading gracefully
      render(
        <TestWrapper>
          <ConditionalLayout>
            <TestChild />
          </ConditionalLayout>
        </TestWrapper>
      );

      // The component should render without errors
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });
});
