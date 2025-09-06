"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyConversation from "./EmptyConversation";
import MessageItem from "./MessageItem";
import { Message, MatchedUser } from "@/types/chat-types";

interface MessageListProps {
    messages: Message[];
    messagesLoading: boolean;
    selectedUser: MatchedUser;
    currentUserId: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUserClick?: (userId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    messagesLoading,
    selectedUser,
    currentUserId,
    messagesEndRef,
    onUserClick
}) => {
    if (messagesLoading) {
        return (
            <LoadingSpinner
                size="md"
                message="Loading messages..."
                className="h-full"
            />
        );
    }

    if (messages.length === 0) {
        return <EmptyConversation selectedUser={selectedUser} />;
    }

    return (
        <>
            {messages.map((message, i) => {
                const isCurrentUser = message.sender?.id === currentUserId;
                return (
                    <MessageItem
                        key={i}
                        message={message}
                        isCurrentUser={isCurrentUser}
                        selectedUserName={selectedUser.name}
                        onUserClick={onUserClick}
                    />
                );
            })}
            <div ref={messagesEndRef} />
        </>
    );
};

export default MessageList;