'use client';
import { MessageSquareDashed } from 'lucide-react';

export const Chatloadingerror = ({ errormessage }: any) => {
  return (
    <div className="text-center flex flex-col justify-center items-center flex-1">
      {errormessage === 'Error occured: Could not find chat' ? (
        <div className="text-center flex flex-col justify-center items-center">
          <MessageSquareDashed size={18} />
          <p className="text-sm text-foreground">Say Hi!</p>
          <p className="text-sm text-muted-foreground">You’ve got a match! Send a message to start chatting.</p>
        </div>
      ) : (
        <p className="text-sm text-red-500">Error loading chat data!</p>
      )}
    </div>
  );
};
