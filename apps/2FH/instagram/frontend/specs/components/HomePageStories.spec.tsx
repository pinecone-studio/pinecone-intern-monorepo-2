import { render, screen } from '@testing-library/react';
import { HomePageStories } from '@/components/HomePageStories';
import { stories } from '@/utils/fake-data';

describe('HomePageStories', () => {
  it('renders all stories with username and correct link', () => {
    render(<HomePageStories />);

    stories.forEach((story) => {
      const links = screen.getAllByRole('link', {
        name: new RegExp(story.username, 'i'),
      });
      const match = links.find((link) => link.getAttribute('href') === `/stories/${story.id}`);
      expect(match).toBeInTheDocument();
    });
  });

  it('renders the correct number of stories', () => {
    render(<HomePageStories />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(stories.length);
  });
});
