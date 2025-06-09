import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

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
  const { user } = useUser();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <p className="text-gray-500">Loading messages...</p>;
  if (!messages?.length) return <p className="text-gray-500">No messages yet.</p>;

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2" data-testid="message-list">
      {messages.map((msg) => {
        const isMyMessage = msg.sender.name === user?.username;
        
        return (
          <div 
            key={msg._id} 
            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              data-testid="message-bubble"
              className={`
                p-3 rounded-lg shadow-sm max-w-[70%]
                ${isMyMessage 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }
              `}
            >
              <div 
                data-testid="sender-name"
                className={`
                  text-sm font-semibold mb-1
                  ${isMyMessage ? 'text-blue-50' : 'text-gray-600'}
                `}
              >
                {isMyMessage ? 'You' : msg.sender.name}
              </div>
              <div data-testid="message-content">{msg.content}</div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageView;
