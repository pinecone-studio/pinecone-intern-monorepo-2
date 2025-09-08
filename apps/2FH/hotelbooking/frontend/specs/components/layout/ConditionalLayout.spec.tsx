/* eslint-disable  */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the public header and footer components
jest.mock('@/components/landing-page/PublicHeader', () => ({
  PublicHeader: () => <div data-testid="public-header">Public Header</div>,
}));

jest.mock('@/components/landing-page/PublicFooter', () => ({
  PublicFooter: () => <div data-testid="public-footer">Public Footer</div>,
}));

describe('ConditionalLayout', () => {
  const TestChild = () => <div data-testid="test-child">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders children with public header and footer for non-admin pages', () => {
    // Mock pathname to be a non-admin page
    (usePathname as jest.Mock).mockReturnValue('/home');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders only children for admin pages', () => {
    // Mock pathname to be an admin page
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders only children for admin pages with nested routes', () => {
    // Mock pathname to be a nested admin page
    (usePathname as jest.Mock).mockReturnValue('/admin/hotels/123/edit');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders children with public header and footer for root path', () => {
    // Mock pathname to be root path
    (usePathname as jest.Mock).mockReturnValue('/');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders children with public header and footer for public pages', () => {
    // Mock pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/about');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders children with public header and footer for login page', () => {
    // Mock pathname to be login page
    (usePathname as jest.Mock).mockReturnValue('/login');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders only children for admin guests page', () => {
    // Mock pathname to be admin guests page
    (usePathname as jest.Mock).mockReturnValue('/admin/guests');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders only children for admin room page', () => {
    // Mock pathname to be admin room page
    (usePathname as jest.Mock).mockReturnValue('/admin/room/123');

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles multiple children correctly for admin pages', () => {
    // Mock pathname to be an admin page
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');

    render(
      <ConditionalLayout>
        <TestChild />
        <div data-testid="another-child">Another Child</div>
      </ConditionalLayout>
    );

    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
  });

  it('handles multiple children correctly for public pages', () => {
    // Mock pathname to be a public page
    (usePathname as jest.Mock).mockReturnValue('/home');

    render(
      <ConditionalLayout>
        <TestChild />
        <div data-testid="another-child">Another Child</div>
      </ConditionalLayout>
    );

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
  });

  it('handles null pathname gracefully', () => {
    // Mock pathname to be null
    (usePathname as jest.Mock).mockReturnValue(null);

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    // Should render with public header and footer when pathname is null
    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles undefined pathname gracefully', () => {
    // Mock pathname to be undefined
    (usePathname as jest.Mock).mockReturnValue(undefined);

    render(
      <ConditionalLayout>
        <TestChild />
      </ConditionalLayout>
    );

    // Should render with public header and footer when pathname is undefined
    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
