"use client";

import React from "react";
import EmptyState from "./EmptyState";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { MatchedUser, Message } from "@/types/chat-types";

interface ChatAreaProps {
    selectedUser: MatchedUser | null;
    messages: Message[];
    messagesLoading: boolean;
    newMessage: string;
    setNewMessage: (message: string) => void;
    handleSendMessage: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    currentUserId: string;
    onUserClick?: (userId: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    selectedUser,
    messages,
    messagesLoading,
    newMessage,
    setNewMessage,
    handleSendMessage,
    messagesEndRef,
    currentUserId,
    onUserClick: _onUserClick
}) => {
    return (
        <div className="w-full border-l flex flex-col h-full overflow-hidden">
            {selectedUser ? (
                <>
                    <ChatHeader selectedUser={selectedUser} />
                    <div className="flex-1 justify-center items-center overflow-y-auto space-y-4 p-4 min-h-0">
                        <MessageList
                            messages={messages}
                            messagesLoading={messagesLoading}
                            selectedUser={selectedUser}
                            currentUserId={currentUserId}
                            messagesEndRef={messagesEndRef}
                            onUserClick={_onUserClick}
                        />
                    </div>
                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                    />
                </>
            ) : (
                <EmptyState
                    icon="💬"
                    title="Select a match to start chatting"
                    subtitle="Choose someone from your matches to begin a conversation"
                    className="h-full"
                />
            )}
        </div>
    );
};

export default ChatArea;