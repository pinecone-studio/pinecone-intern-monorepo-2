import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageView from '@/app/message/_components/MessageView';
import '@testing-library/jest-dom';

const mockUser = { username: 'John' };

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: mockUser }),
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});


describe('MessageView', () => {
  const messages = [
    {
      _id: '1',
      content: 'Hello there!',
      sender: { _id: 'user1', name: 'John' }, 
    },
    {
      _id: '2',
      content: 'Hi! How are you?',
      sender: { _id: 'user2', name: 'Jane' },
    },
  ];

  it('renders loading state when loading is true', () => {
    render(<MessageView messages={[]} loading={true} />);
    expect(screen.getByText(/loading messages/i)).toBeInTheDocument();
  });

  it('renders empty state when there are no messages', () => {
    render(<MessageView messages={[]} loading={false} />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it('renders message bubbles for each message', () => {
    render(<MessageView messages={messages} loading={false} />);
    
    const messageBubbles = screen.getAllByTestId('message-bubble');
    expect(messageBubbles).toHaveLength(2);

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();

    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByText('Hi! How are you?')).toBeInTheDocument();
  });

  it('scrolls to bottom on new messages', () => {
    const scrollIntoView = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    const { rerender } = render(<MessageView messages={[]} loading={false} />);
    rerender(<MessageView messages={messages} loading={false} />);
    
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
