'use client';

import { useState } from 'react';
import { useSendMessageMutation } from '@/generated';

const SendMessage = ({
  matchId,
  onMessageSent,
}: {
  matchId: string;
  onMessageSent?: () => void;
}) => {
  const [content, setContent] = useState('');
  const [sendMessage, { loading }] = useSendMessageMutation();

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      await sendMessage({
        variables: {
          matchId,
          content,
        },
      });
      setContent('');
      onMessageSent?.(); 
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Write a message..."
        disabled={loading}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default SendMessage;
