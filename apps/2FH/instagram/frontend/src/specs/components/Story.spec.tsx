// next/image mock хийх хэрэгтэй
jest.mock('next/image', () => {
  const MockImage = (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { stories } from '../../utils/fake-data';
import { Stories } from '@/components/Story';

describe('Stories Component', () => {
  it('renders all stories with username and image', () => {
    const { container } = render(<Stories />);

    // Бүх username харагдаж байгаа эсэх (нэр адил тул тоогоор шалгана)
    const labels = screen.getAllByText(stories[0].username);
    expect(labels.length).toBe(stories.length);

    // Бүх зураг харагдаж байгаа эсэх (aria-hidden тул role-оор биш DOM-оор шалгана)
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(stories.length);
  });

  it('each story has correct href', () => {
    render(<Stories />);
    const links = screen.getAllByRole('link');
    stories.forEach((story) => {
      const match = links.find((a) => a.getAttribute('href') === `/stories/${story.id}`);
      expect(match).toBeTruthy();
    });
  });

  it('gradient class is applied', () => {
    render(<Stories />);
    const firstStory = screen.getAllByRole('link')[0];
    expect(firstStory.firstChild).toHaveClass('bg-gradient-to-tr');
  });
});
