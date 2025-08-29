// Mock next/image to render normal img
// eslint-disable-next-line @next/next/no-img-element
jest.mock('next/image', () => {
  // eslint-disable-next-line @next/next/no-img-element  
  const MockImage = (props: React.ComponentProps<'img'>) => <img {...props} alt={props.alt} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// Mock posts data
jest.mock('@/utils/fake-data', () => ({
  posts: [
    {
      id: 1,
      username: 'john',
      timeAgo: '2h',
      image: '/demo.jpg',
      likes: 100,
      caption: 'hello world',
      comments: 5,
    },
  ],
}));

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Posts } from '@/components';

describe('Posts component', () => {
  it('renders post content correctly', () => {
    render(<Posts />);
    expect(screen.getAllByText('john').length).toBeGreaterThan(0);
    expect(screen.getByText(/hello world/)).toBeInTheDocument();
    expect(screen.getByText(/100 likes/)).toBeInTheDocument();
  });

  it('toggles like button color on click', () => {
    render(<Posts />);
    const heart = screen.getByTestId('heart-1');
    expect(heart).not.toHaveClass('text-red-500');
    fireEvent.click(heart);
    expect(heart).toHaveClass('text-red-500');
    fireEvent.click(heart);
    expect(heart).not.toHaveClass('text-red-500');
  });

  it('toggles bookmark fill on click', () => {
    render(<Posts />);
    const bookmark = screen.getByTestId('bookmark-1');
    expect(bookmark).not.toHaveClass('fill-current');
    fireEvent.click(bookmark);
    expect(bookmark).toHaveClass('fill-current');
    fireEvent.click(bookmark);
    expect(bookmark).not.toHaveClass('fill-current');
  });
});
