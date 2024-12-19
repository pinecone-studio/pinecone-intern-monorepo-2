'use client';

import { Chatpart } from '@/components/Chatpart';
import { Chatsidebar } from '@/components/Chatsidebar';
import { Loader } from '@/components/Loader';
import { Matches } from '@/components/Matches';
import { useMatchedUsersContext } from '@/components/providers/MatchProvider';
import { useOneUserContext } from '@/components/providers/OneuserProvider';
import { CREATE_CHAT, GET_CHAT } from '@/graphql/chatgraphql';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

const Chat = () => {
  const { matchedData, matchloading,refetchmatch } = useMatchedUsersContext();
  const [message, setMessage] = useState<string>('');
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { oneUserloading} = useOneUserContext();
  const [createChat] = useMutation(CREATE_CHAT);
  const user1 = '6747be56eef691c549c23461';
  const user2 = id;
  const { loading, error, data, refetch } = useQuery(GET_CHAT, {
    variables: {
      input: {
        user1: user1,
        user2: user2,
      },
    },
    // pollInterval:5
  });
  const chatloading = oneUserloading || loading;
  const response = data?.getChat;
  const pageloading = matchloading || oneUserloading || loading;
  const errormessage = error?.message;
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    try {
      await createChat({
        variables: {
          input: {
            content: message,
            user2:user2,
            senderId: user1
          },
        },
      });
      setMessage('');
      refetch();
      refetchmatch();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <>
      {pageloading? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : matchedData? (
        <div className="max-w-[1000px] m-auto h-screen flex flex-col">
        <Matches />
        <div className="flex flex-1">
          <Chatsidebar />
          <Chatpart chatloading={chatloading} response={response} errormessage={errormessage} handleMessageChange={handleMessageChange} sendMessage={sendMessage} message={message} user1={user1} />
        </div>
      </div>
      ) : (
        <div className='flex flex-col justify-center items-center h-screen'>
          <p>No Matches Yet</p>
          <p>Keep swiping, your next match could be just around the corner!</p>
        </div>
      )}
    </>
  );
};
export default Chat;
