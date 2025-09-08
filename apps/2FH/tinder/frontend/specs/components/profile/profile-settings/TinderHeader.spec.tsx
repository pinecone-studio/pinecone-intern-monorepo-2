import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TinderHeader } from '@/components/profile/profile-settings/TinderHeader';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('TinderHeader Component', () => {
  it('renders header with logo image by default', () => {
    render(<TinderHeader />);
    const logoImage = screen.getByAltText('logo');
    expect(logoImage).toHaveAttribute('src', '/tindalogos.svg');
    expect(logoImage).toHaveClass('w-20 h-10 object-contain');
  });

  it('renders notification button with image', () => {
    render(<TinderHeader />);
    const notificationImage = screen.getByAltText('notification');
    expect(notificationImage).toHaveAttribute('src', '/message-square.svg');
    const button = notificationImage.closest('button');
    expect(button).toHaveClass('p-2 hover:bg-gray-100 rounded-full transition-colors');
  });

  it('applies correct container styling', () => {
    render(<TinderHeader />);
    const container = screen.getByAltText('logo').closest('div.bg-white');
    expect(container).toHaveClass('bg-white px-4 py-3.5');
    expect(container?.querySelector('div')).toHaveClass('max-w-6xl mx-auto');
  });

  it('handles notification button click', () => {
    render(<TinderHeader />);
    const button = screen.getByAltText('notification').closest('button');
    fireEvent.click(button);
    expect(button).toHaveClass('p-2 hover:bg-gray-100 rounded-full transition-colors');
  });

  it('shows fallback SVG when logo fails to load', () => {
    render(<TinderHeader />);
    
    // Initially should show the logo image
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    
    // Simulate logo load error
    const logoImage = screen.getByAltText('logo');
    fireEvent.error(logoImage);
    
    // Should now show fallback SVG instead of logo
    expect(screen.queryByAltText('logo')).not.toBeInTheDocument();
    const fallbackSvg = document.querySelector('svg.w-10.h-6.text-red-500');
    expect(fallbackSvg).toBeInTheDocument();
  });
});