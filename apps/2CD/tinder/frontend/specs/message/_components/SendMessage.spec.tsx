import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SendMessage from '@/app/message/_components/SendMessage';
import '@testing-library/jest-dom';

const mockSendMessage = jest.fn();

jest.mock('@/generated', () => ({
  useSendMessageMutation: () => [
    mockSendMessage,
    { loading: false },
  ],
}));

describe('SendMessage', () => {
  const matchId = 'match123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button', () => {
    render(<SendMessage matchId={matchId} />);
    expect(screen.getByPlaceholderText(/write a message/i)).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SendMessage matchId={matchId} />);
    const input = screen.getByPlaceholderText(/write a message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello!' } });
    expect(input.value).toBe('Hello!');
  });

  it('calls sendMessage and clears input on click', async () => {
    mockSendMessage.mockResolvedValueOnce({ data: {} });

    render(<SendMessage matchId={matchId} />);
    const input = screen.getByPlaceholderText(/write a message/i);
    const button = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hi there!' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        variables: {
          matchId: 'match123',
          content: 'Hi there!',
        },
      });
    });

    expect(input).toHaveValue('');
  });

  it('calls onMessageSent callback after send', async () => {
    mockSendMessage.mockResolvedValueOnce({ data: {} });
    const onMessageSent = jest.fn();

    render(<SendMessage matchId={matchId} onMessageSent={onMessageSent} />);
    const input = screen.getByPlaceholderText(/write a message/i);
    fireEvent.change(input, { target: { value: 'Testing callback' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
      expect(onMessageSent).toHaveBeenCalled();
    });
  });

  it('does not call sendMessage with empty input', () => {
    render(<SendMessage matchId={matchId} />);
    const button = screen.getByText('Send');
    fireEvent.click(button);
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
