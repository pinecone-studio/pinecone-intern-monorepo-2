"use client";

import ChatHistory from "../../components/chat/ChatHistory";
import { useGetProfileQuery } from "@/generated";
import { calculateAge } from "@/utils/utils";
const userId = "68a564a552cf45602b4c2d60";

const ChatPage = () => {
  const { data, loading, error } = useGetProfileQuery({
    variables: {
      userId: userId
    }
  });

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 mx-80">
        <p className="text-2xl font-bold m-5">Matches</p>
        <div className="flex mx-20 gap-4">
          {data?.getProfile?.matches?.map((match) => (
            <div key={match.id} className="flex flex-col gap-2 w-20 text-center justify-center items-center m-5">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="size-10 rounded-full"
                alt={match.name || "User"}
              />
              <div className="flex gap-2">
                <p className="text-2xl font-bold">{match.name?.toUpperCase() || "Unknown"},</p>
                <span className="text-xl text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full">
                  {calculateAge(match.dateOfBirth)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{match.work || "No work info"}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex mx-80">
        <ChatHistory />
      </div>
    </div>
  );
};

export default ChatPage;