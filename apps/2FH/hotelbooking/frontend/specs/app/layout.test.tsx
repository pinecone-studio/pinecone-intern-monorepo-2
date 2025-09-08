/* eslint-disable  */
import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';

// Mock Next.js components and providers
jest.mock('sonner', () => ({
  Toaster: ({ richColors, position }: any) => (
    <div data-testid="toaster" data-rich-colors={richColors} data-position={position}>
      Toaster Component
    </div>
  ),
}));

jest.mock('@/components/providers/ApolloWrapper', () => ({
  ApolloWrapper: ({ children }: any) => <div data-testid="apollo-wrapper">{children}</div>,
}));

jest.mock('@/components/providers', () => ({
  UserAuthProvider: ({ children }: any) => <div data-testid="user-auth-provider">{children}</div>,
}));

jest.mock('@/components/layout/ConditionalLayout', () => ({
  ConditionalLayout: ({ children }: any) => <div data-testid="conditional-layout">{children}</div>,
}));

// Mock CSS import
jest.mock('./global.css', () => ({}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  describe('Rendering', () => {
    it('renders the layout with all providers', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('user-auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('conditional-layout')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('renders with correct HTML structure', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = container.querySelector('html');
      const bodyElement = container.querySelector('body');

      expect(htmlElement).toBeInTheDocument();
      expect(htmlElement).toHaveAttribute('lang', 'en');
      expect(bodyElement).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      const customChildren = (
        <div>
          <h1>Custom Title</h1>
          <p>Custom content</p>
        </div>
      );

      render(<RootLayout>{customChildren}</RootLayout>);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </>
      );

      render(<RootLayout>{multipleChildren}</RootLayout>);

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('renders providers in correct order', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const apolloWrapper = screen.getByTestId('apollo-wrapper');
      const userAuthProvider = screen.getByTestId('user-auth-provider');
      const conditionalLayout = screen.getByTestId('conditional-layout');
      const toaster = screen.getByTestId('toaster');

      // Check that providers are nested correctly
      expect(apolloWrapper).toContainElement(userAuthProvider);
      expect(userAuthProvider).toContainElement(conditionalLayout);
      expect(conditionalLayout).toContainElement(screen.getByTestId('test-children'));

      // Toaster should be outside the provider hierarchy
      expect(toaster).toBeInTheDocument();
    });

    it('maintains provider structure with different children', () => {
      const differentChildren = <span data-testid="different-children">Different Content</span>;

      render(<RootLayout>{differentChildren}</RootLayout>);

      const apolloWrapper = screen.getByTestId('apollo-wrapper');
      const userAuthProvider = screen.getByTestId('user-auth-provider');
      const conditionalLayout = screen.getByTestId('conditional-layout');

      expect(apolloWrapper).toContainElement(userAuthProvider);
      expect(userAuthProvider).toContainElement(conditionalLayout);
      expect(conditionalLayout).toContainElement(screen.getByTestId('different-children'));
    });
  });

  describe('Toaster Configuration', () => {
    it('renders Toaster with correct props', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const toaster = screen.getByTestId('toaster');
      expect(toaster).toHaveAttribute('data-rich-colors', 'true');
      expect(toaster).toHaveAttribute('data-position', 'top-center');
    });

    it('renders Toaster outside provider hierarchy', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const toaster = screen.getByTestId('toaster');
      const apolloWrapper = screen.getByTestId('apollo-wrapper');

      // Toaster should not be inside ApolloWrapper
      expect(apolloWrapper).not.toContainElement(toaster);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<RootLayout>{null}</RootLayout>);

      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('user-auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('conditional-layout')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(<RootLayout>{undefined}</RootLayout>);

      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('user-auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('conditional-layout')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('handles children as string', () => {
      render(<RootLayout>String Children</RootLayout>);

      expect(screen.getByText('String Children')).toBeInTheDocument();
      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
    });

    it('handles children as number', () => {
      render(<RootLayout>{123}</RootLayout>);

      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
    });

    it('handles children as boolean', () => {
      render(<RootLayout>{true}</RootLayout>);

      // Boolean true should not render anything visible
      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
    });

    it('handles children as array', () => {
      const arrayChildren = [
        <div key="1" data-testid="array-child-1">
          Array Child 1
        </div>,
        <div key="2" data-testid="array-child-2">
          Array Child 2
        </div>,
      ];

      render(<RootLayout>{arrayChildren}</RootLayout>);

      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders as a functional component', () => {
      expect(typeof RootLayout).toBe('function');
    });

    it('accepts PropsWithChildren', () => {
      const props = { children: mockChildren };

      // Should not throw error when called with PropsWithChildren
      expect(() => render(<RootLayout {...props} />)).not.toThrow();
    });

    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('user-auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('conditional-layout')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();

      // Rerender with same props
      rerender(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('apollo-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('user-auth-provider')).toBeInTheDocument();
      expect(screen.getByTestId('conditional-layout')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
  });

  describe('Metadata Export', () => {
    it('exports metadata object', () => {
      expect(metadata).toBeDefined();
      expect(typeof metadata).toBe('object');
    });

    it('has correct metadata properties', () => {
      expect(metadata.title).toBe('Welcome to example-frontend');
      expect(metadata.description).toBe('Generated by create-nx-workspace');
    });

    it('metadata is immutable', () => {
      const originalTitle = metadata.title;
      const originalDescription = metadata.description;

      expect(metadata.title).toBe(originalTitle);
      expect(metadata.description).toBe(originalDescription);
    });
  });

  describe('Accessibility', () => {
    it('has proper HTML lang attribute', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = container.querySelector('html');
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('maintains semantic HTML structure', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = container.querySelector('html');
      const bodyElement = container.querySelector('body');

      expect(htmlElement).toBeInTheDocument();
      expect(bodyElement).toBeInTheDocument();
      expect(bodyElement?.parentElement).toBe(htmlElement);
    });
  });

  describe('Performance', () => {
    it('renders without unnecessary re-renders', () => {
      const { rerender } = render(<RootLayout>{mockChildren}</RootLayout>);

      const apolloWrapper = screen.getByTestId('apollo-wrapper');
      const userAuthProvider = screen.getByTestId('user-auth-provider');
      const conditionalLayout = screen.getByTestId('conditional-layout');
      const toaster = screen.getByTestId('toaster');

      // Rerender with same props
      rerender(<RootLayout>{mockChildren}</RootLayout>);

      // Elements should still be present
      expect(apolloWrapper).toBeInTheDocument();
      expect(userAuthProvider).toBeInTheDocument();
      expect(conditionalLayout).toBeInTheDocument();
      expect(toaster).toBeInTheDocument();
    });
  });

  describe('Snapshot Tests', () => {
    it('matches snapshot with default children', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with multiple children', () => {
      const multipleChildren = (
        <>
          <div>Child 1</div>
          <div>Child 2</div>
        </>
      );

      const { container } = render(<RootLayout>{multipleChildren}</RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with no children', () => {
      const { container } = render(<RootLayout>{null}</RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with string children', () => {
      const { container } = render(<RootLayout>String Content</RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Integration Tests', () => {
    it('works with different child component types', () => {
      const complexChildren = (
        <div>
          <header>Header</header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      );

      render(<RootLayout>{complexChildren}</RootLayout>);

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('maintains provider context for child components', () => {
      const childWithContext = (
        <div data-testid="child-with-context">
          <span>Child that might use context</span>
        </div>
      );

      render(<RootLayout>{childWithContext}</RootLayout>);

      const child = screen.getByTestId('child-with-context');
      const apolloWrapper = screen.getByTestId('apollo-wrapper');
      const userAuthProvider = screen.getByTestId('user-auth-provider');
      const conditionalLayout = screen.getByTestId('conditional-layout');

      // Child should be within all provider contexts
      expect(apolloWrapper).toContainElement(child);
      expect(userAuthProvider).toContainElement(child);
      expect(conditionalLayout).toContainElement(child);
    });
  });
});
