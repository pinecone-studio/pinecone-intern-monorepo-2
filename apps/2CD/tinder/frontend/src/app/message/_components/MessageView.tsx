import { useEffect, useRef } from 'react';

interface Sender {
  _id: string;
  name: string;
}

interface Message {
  _id: string;
  content: string;
  sender: Sender;
}

const MessageView = ({ messages, loading }: { messages: Message[]; loading: boolean }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <p className="text-gray-500">Loading messages...</p>;
  if (!messages?.length) return <p className="text-gray-500">No messages yet.</p>;

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
      {messages.map((msg) => (
        <div key={msg._id} className="p-3 bg-white rounded shadow-sm w-40">
          <div className="text-sm text-gray-600 font-semibold mb-1">{msg.sender.name}</div>
          <div className="text-gray-800">{msg.content}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageView;
