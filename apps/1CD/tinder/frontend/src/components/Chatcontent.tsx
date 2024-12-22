'use client'
import { Matches } from '@/components/Matches';
import { Chatsidebar } from '@/components/Chatsidebar';
import { Chatpart } from '@/components/Chatpart';
import { ChangeEvent } from 'react';

type ChatContentProps = {
  chatloading: boolean;
  response: any;
  errormessage: any;
  loading: boolean;
  handleMessageChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  message: string;
};

const ChatContent = ({
  chatloading,
  response,
  errormessage,
  loading,
  handleMessageChange,
  sendMessage,
  message,
}: ChatContentProps) => {
  return (
    <div className="max-w-[1000px] m-auto h-screen flex flex-col">
      <Matches />
      <div className="flex flex-1">
        <Chatsidebar />
        <Chatpart
          chatloading={chatloading}
          response={response}
          errormessage={errormessage}
          loading={loading}
          handleMessageChange={handleMessageChange}
          sendMessage={sendMessage}
          message={message}
        />
      </div>
    </div>
  );
};

export default ChatContent;
