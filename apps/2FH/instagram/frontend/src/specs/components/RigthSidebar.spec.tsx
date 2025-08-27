import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RightSidebar } from '@/components/RightSidebar';

describe('RightSidebar', () => {
  it('renders user info section', () => {
    render(<RightSidebar />);

    expect(screen.getByText('upvote_')).toBeInTheDocument();
    expect(screen.getByText('Upvote')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('renders suggestions section', () => {
    render(<RightSidebar />);

    expect(screen.getByText('Suggestions for you')).toBeInTheDocument();
    expect(screen.getByText('See All')).toBeInTheDocument();
    expect(screen.getByText('linktr')).toBeInTheDocument();
    expect(screen.getByText('baylejf')).toBeInTheDocument();
  });

  it('renders follow buttons', () => {
    render(<RightSidebar />);

    const followButtons = screen.getAllByText('Follow');
    expect(followButtons).toHaveLength(5);
  });
});
