'use client';

import { Chatsidebar } from '@/components/Chatsidebar';
import { Loader } from '@/components/Loader';
import { Matches } from '@/components/Matches';
import { useMatchedUsersContext } from '@/components/providers/MatchProvider';

const Chat = () => {
  const { matchedData, matchloading, matcherror } = useMatchedUsersContext();
  return (
    <>
      {matchloading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : matchedData ? (
        <div className="max-w-[1000px] m-auto h-screen flex flex-col">
          <Matches />
          <div className="flex flex-1">
            <Chatsidebar />
            <div className="flex-1 border flex flex-col justify-center items-center">
              <p className="text-foreground text-base">Hi, you’ve got a match!</p>
              <p className="text-muted-foreground">Choose a match and start chatting</p>
            </div>
          </div>
        </div>
      ) : matcherror.message === 'Error occurred: No matches found' ? (
        <div className="text-center mt-10 flex flex-col justify-center items-center h-screen">
          <p>No Matches Yet</p>
          <p>Keep swiping, your next match could be just around the corner!</p>
        </div>
      ) : (
        <div className="text-center mt-10 flex justify-center items-center h-screen">
          <p>Error occured try again</p>
        </div>
      )}
    </>
  );
};
export default Chat;
