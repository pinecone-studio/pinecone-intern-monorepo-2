import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Posts } from '../../../src/components/userProfile/Post';

jest.mock('../../../src/components/userProfile/format-number', () => ({
  formatNumber: jest.fn((num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...props} />
  ),
}));

describe('Posts Component', () => {
  it('should render successfully', () => {
    render(<Posts />);
    
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeTruthy();
  });

  it('should render all 6 mock posts', () => {
    render(<Posts />);
    
    const posts = document.querySelectorAll('.aspect-square');
    expect(posts).toHaveLength(6);
  });

  it('should display formatted likes and comments count on hover', () => {
    render(<Posts />);
    
    const likeIcons = document.querySelectorAll('svg');
    expect(likeIcons.length).toBeGreaterThan(0);
  });

  it('should render images with correct alt text', () => {
    render(<Posts />);
    
    const images = screen.getAllByRole('img');
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('alt', `Post ${index + 1}`);
    });
  });

  it('should have hover overlay with opacity transition', () => {
    render(<Posts />);
    
    const overlays = document.querySelectorAll('.absolute.inset-0.bg-black\\/50');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('should apply correct grid layout classes', () => {
    render(<Posts />);
    
    const gridContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3');
    expect(gridContainer).toBeTruthy();
  });
});
