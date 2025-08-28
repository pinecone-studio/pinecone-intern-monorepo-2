import { MainFooter } from '@/components/MainFooter';
import { render, screen } from '@testing-library/react';

describe('MainFooter', () => {
  it('renders all footer links', () => {
    render(<MainFooter />);

    const linksText = ['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified'];

    linksText.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('renders copyright text', () => {
    render(<MainFooter />);
    expect(screen.getByText(/© 2024 INSTAGRAM FROM META/i)).toBeInTheDocument();
  });
});
