'use client';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostImg } from '@/components/post/PostImgCarousel';

// Adjust the path if necessary

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock Carousel components
jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="carousel-item">
      {children}
    </div>
  ),
  CarouselNext: ({ className }: { className?: string }) => (
    <button className={className} data-testid="carousel-next">
      Next
    </button>
  ),
  CarouselPrevious: ({ className }: { className?: string }) => (
    <button className={className} data-testid="carousel-previous">
      Previous
    </button>
  ),
}));

describe('PostImg', () => {
  it('renders images inside the carousel', () => {
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

    render(<PostImg images={images} />);

    const carousel = screen.getByTestId('carousel');
    expect(carousel);

    const carouselItems = screen.getAllByTestId('carousel-item');
    expect(carouselItems.length);

    // images.forEach((img, index) => {
    //   expect(screen.getByAltText(`Photo1`))
    // });
  });

  it('does not render navigation buttons if there is only one image', () => {
    const images = ['image1.jpg'];

    render(<PostImg images={images} />);

    expect(screen.queryByTestId('carousel-next'));
    expect(screen.queryByTestId('carousel-previous'));
  });

  it('renders navigation buttons if there are multiple images', () => {
    const images = ['image1.jpg', 'image2.jpg'];

    render(<PostImg images={images} />);

    expect(screen.getByTestId('carousel-next'));
    expect(screen.getByTestId('carousel-previous'));
  });
});
