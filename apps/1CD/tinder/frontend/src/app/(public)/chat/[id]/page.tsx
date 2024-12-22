'use client';

import { useState, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CREATE_CHAT } from '@/graphql/chatgraphql';
import { useChatLogic } from '@/app/useChatLogic';
import LoadingScreen from '@/components/Loadingscreen';
import ChatContent from '@/components/Chatcontent';
import ErrorScreen from '@/components/Errorscreen';


const Chat = () => {
  const [message, setMessage] = useState<string>('');
  const params = useParams<{ id: string }>();
  const { id } = params;
  const user2 = id;

  const {
    chatloading,
    response,
    pageloading,
    errormessage,
    matcherror,
    refetch,
    refetchmatch,
  } = useChatLogic(user2);

  const [createChat] = useMutation(CREATE_CHAT);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    await createChat({
      variables: {
        input: {
          content: message,
          user2,
        },
      },
    });
    setMessage('');
    refetch();
    refetchmatch();
  };

  if (pageloading) {
    return <LoadingScreen />;
  }

  if (matcherror === 'Error occurred: No matches found') {
    return <ErrorScreen message="No Matches Yet. Keep swiping, your next match could be just around the corner!" />;
  }

  return <div data-cy="Chat-Page-With-Id">
  <ChatContent
    chatloading={chatloading}
    response={response}
    errormessage={errormessage}
    loading={chatloading}
    handleMessageChange={handleMessageChange}
    sendMessage={sendMessage}
    message={message}
  />
</div>
};

export default Chat;
