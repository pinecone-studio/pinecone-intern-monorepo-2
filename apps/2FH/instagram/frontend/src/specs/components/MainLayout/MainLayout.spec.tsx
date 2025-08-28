import { render, screen } from '@testing-library/react';

// useNavigation hook-ийг mock хийх
jest.mock('../../../components/NavigationProvider/NavigationProvider', () => ({
  useNavigation: jest.fn(),
}));

import { MainLayout } from '@/components/MainLayout/MainLayout';
import { useNavigation } from '@/components/NavigationProvider/NavigationProvider';

describe('MainLayout', () => {
  it('renders children correctly', () => {
    (useNavigation as jest.Mock).mockReturnValue({ isSearchOpen: false });

    render(
      <MainLayout>
        <div data-testid="child">Child Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies ml-[400px] when isSearchOpen is true', () => {
    (useNavigation as jest.Mock).mockReturnValue({ isSearchOpen: true });

    const { container } = render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('ml-[400px]');
    expect(mainElement).toHaveClass('transition-all');
  });

  it('applies ml-64 when isSearchOpen is false', () => {
    (useNavigation as jest.Mock).mockReturnValue({ isSearchOpen: false });

    const { container } = render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('ml-64');
  });
});
