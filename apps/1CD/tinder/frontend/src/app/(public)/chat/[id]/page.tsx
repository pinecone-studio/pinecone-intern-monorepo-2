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
  const { matchedData, matchloading, refetchmatch, matcherror } = useMatchedUsersContext();
  const [message, setMessage] = useState<string>('');
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { oneUserloading, oneusererror } = useOneUserContext();
  const [createChat] = useMutation(CREATE_CHAT);
  const user2 = id;
  const { loading, error, data, refetch } = useQuery(GET_CHAT, {
    variables: {
      input: {
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
            user2: user2,
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
      {pageloading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : matchedData ? (
        <div className="max-w-[1000px] m-auto h-screen flex flex-col">
          <Matches />
          <div className="flex flex-1">
            <Chatsidebar />
            <Chatpart chatloading={chatloading} response={response} errormessage={errormessage} handleMessageChange={handleMessageChange} sendMessage={sendMessage} message={message} />
          </div>
        </div>
      ) : matcherror.message === 'Error occurred: No matches found' ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <p>No Matches Yet</p>
          <p>Keep swiping, your next match could be just around the corner!</p>
        </div>
      ) : oneusererror || error ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <p>Error occured try again</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <p>Error occured try again</p>
        </div>
      )}
    </>
  );
};
export default Chat;
