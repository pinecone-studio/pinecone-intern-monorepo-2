// specs/components/MainLayout/MainLayout.spec.tsx
import { render, screen } from '@testing-library/react';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import React from 'react';

jest.mock('@/components/NavigationProvider/NavigationProvider', () => ({
  useNavigation: jest.fn(),
}));

import { useNavigation } from '@/components/NavigationProvider/NavigationProvider';
const mockedUseNavigation = useNavigation as jest.Mock;

describe('MainLayout', () => {
  it('renders children', () => {
    mockedUseNavigation.mockReturnValue({ isSearchOpen: false });
    render(
      <MainLayout>
        <div data-testid="child">Child</div>
      </MainLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies correct classes when isSearchOpen=false', () => {
    mockedUseNavigation.mockReturnValue({ isSearchOpen: false });
    render(<MainLayout>Content</MainLayout>);
    expect(screen.getByTestId('main-layout')).toHaveClass('ml-0');
  });

  it('applies correct classes when isSearchOpen=true', () => {
    mockedUseNavigation.mockReturnValue({ isSearchOpen: true });
    render(<MainLayout>Content</MainLayout>);
    expect(screen.getByTestId('main-layout')).toHaveClass('ml-0');
  });
});
