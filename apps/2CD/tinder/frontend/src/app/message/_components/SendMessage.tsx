"use client";

import { useState } from 'react';
import { useSendMessageMutation } from '@/generated';



const SendMessage = ({ matchId }: { matchId: string}) => {
  const [content, setContent] = useState('');
  const [sendMessage] = useSendMessageMutation();

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
        className="flex-1 border p-2 rounded"
        placeholder="Write a message..."
      />
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
};

export default SendMessage;
