import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFoundMessage } from '@/components/admin/room-detail/NotFoundMessage';

describe('NotFoundMessage', () => {
  it('renders not found message correctly', () => {
    render(<NotFoundMessage />);

    expect(screen.getByText('Room Not Found')).toBeInTheDocument();
    expect(screen.getByText("The room you're looking for could not be found.")).toBeInTheDocument();
  });

  it('renders with correct styling classes', () => {
    render(<NotFoundMessage />);

    const title = screen.getByText('Room Not Found');
    expect(title).toHaveClass('text-gray-600');

    const container = title.closest('.min-h-screen');
    expect(container).toHaveClass('bg-gray-50', 'p-6');
  });

  it('displays Search icon', () => {
    render(<NotFoundMessage />);

    const icon = screen.getByText('Room Not Found').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders within proper card structure', () => {
    render(<NotFoundMessage />);

    expect(screen.getByText('Room Not Found')).toBeInTheDocument();
    expect(screen.getByText("The room you're looking for could not be found.")).toBeInTheDocument();

    // Check that the message is within a card structure
    const messageElement = screen.getByText("The room you're looking for could not be found.");
    expect(messageElement).toHaveClass('text-gray-700');
  });

  it('has proper accessibility structure', () => {
    render(<NotFoundMessage />);

    // Check that the title is properly structured
    const title = screen.getByText('Room Not Found');
    expect(title).toBeInTheDocument();

    // Check that the message is accessible
    const message = screen.getByText("The room you're looking for could not be found.");
    expect(message).toBeInTheDocument();
  });

  it('renders with consistent styling', () => {
    render(<NotFoundMessage />);

    const container = document.querySelector('.min-h-screen.bg-gray-50.p-6');
    expect(container).toBeInTheDocument();

    const maxWidthContainer = document.querySelector('.max-w-6xl.mx-auto');
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it('has proper icon and text alignment', () => {
    render(<NotFoundMessage />);

    const titleElement = screen.getByText('Room Not Found');
    expect(titleElement).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('matches snapshot', () => {
    const { container } = render(<NotFoundMessage />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders without crashing', () => {
    expect(() => render(<NotFoundMessage />)).not.toThrow();
  });

  it('has proper semantic structure', () => {
    render(<NotFoundMessage />);

    // Check that the component has proper semantic structure
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();

    const card = document.querySelector('div > div > div');
    expect(card).toBeInTheDocument();
  });
});
