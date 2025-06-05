'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { GetMessageQuery, useGetMyMatchesQuery, useGetMessageQuery } from '@/generated';
import { MatchList } from '../_components/MatchList';
import MessageView from '../_components/MessageView';
import SendMessage from '../_components/SendMessage';

const LoadingState = () => <p className="p-4">Loading matches...</p>;
const ErrorState = ({ message }: { message: string }) => (
  <p className="p-4 text-red-500">Error: {message}</p>
);

interface ChatSectionProps {
  selectedMatchId: string | null;
  messageData: GetMessageQuery | undefined;
  loadingMessages: boolean;
  refetch: () => void;
}

const ChatSection = ({ 
  selectedMatchId, 
  messageData, 
  loadingMessages, 
  refetch 
}: ChatSectionProps) => (
  <div className="w-2/3 p-4 flex flex-col">
    <h2 className="text-xl font-bold mb-4">Chat</h2>
    <MessageView 
      messages={messageData?.getMessage?.map(msg => ({
        _id: msg._id,
        content: msg.content,
        sender: {
          _id: msg.sender._id,
          name: msg.sender.name || 'Unknown'
        }
      })) || []} 
      loading={loadingMessages} 
    />
    {selectedMatchId && (
      <SendMessage matchId={selectedMatchId} onMessageSent={refetch} />
    )}
  </div>
);

export const Messages = () => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { user } = useUser();

  const { data: matchData, loading: loadingMatches, error: matchError } = useGetMyMatchesQuery();
  const { data: messageData, loading: loadingMessages, refetch } = useGetMessageQuery({
    skip: !selectedMatchId,
    variables: { matchId: selectedMatchId || '' },
  });

  if (loadingMatches) return <LoadingState />;
  if (matchError) return <ErrorState message={matchError.message} />;

  const matches = matchData?.getMyMatches?.map(match => ({
    _id: match._id,
    users: match.users.map(user => ({
      _id: user.clerkId || match._id,
      name: user.name || undefined,
      clerkId: user.clerkId || undefined
    }))
  })) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <MatchList
        matches={matches}
        selectedMatchId={selectedMatchId}
        onSelect={setSelectedMatchId}
        currentUserId={user?.id}
      />
      <ChatSection
        selectedMatchId={selectedMatchId}
        messageData={messageData}
        loadingMessages={loadingMessages}
        refetch={refetch}
      />
    </div>
  );
};
